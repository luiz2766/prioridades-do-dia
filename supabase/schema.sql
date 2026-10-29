-- ==============================================================================
-- SISTEMA OPERACIONAL: PRIORIDADES DO DIA
-- SCRIPT SQL DE BANCO DE DADOS, SEGURANÇA (RLS), TRIGGER E REALTIME
-- ==============================================================================

-- 1. Criação da Tabela public.priorities
CREATE TABLE IF NOT EXISTS public.priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code TEXT NOT NULL CHECK (length(trim(customer_code)) > 0),
    customer_name TEXT NOT NULL CHECK (length(trim(customer_name)) > 0),
    reason TEXT NOT NULL CHECK (length(trim(reason)) > 0),
    notes TEXT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito')),
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    accepted_by UUID REFERENCES auth.users(id) NULL,
    accepted_at TIMESTAMPTZ NULL
);

-- Comentários para documentação do schema
COMMENT ON TABLE public.priorities IS 'Registros diários de prioridades operacionais cadastradas pela força de vendas';
COMMENT ON COLUMN public.priorities.customer_code IS 'Código do cliente no ERP (obrigatório, trim > 0)';
COMMENT ON COLUMN public.priorities.customer_name IS 'Razão social ou nome fantasia (obrigatório, trim > 0)';
COMMENT ON COLUMN public.priorities.reason IS 'Motivo da priorização (obrigatório)';
COMMENT ON COLUMN public.priorities.notes IS 'Observações complementares opcionais';
COMMENT ON COLUMN public.priorities.status IS 'Status da solicitação: pendente ou aceito';
COMMENT ON COLUMN public.priorities.created_by IS 'Usuário supervisor que realizou o cadastro';
COMMENT ON COLUMN public.priorities.accepted_by IS 'Usuário que marcou o aceite';

-- 2. Índices de Otimização
CREATE INDEX IF NOT EXISTS idx_priorities_created_at ON public.priorities (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_priorities_status ON public.priorities (status);
CREATE INDEX IF NOT EXISTS idx_priorities_created_by ON public.priorities (created_by);

-- 3. Função e Trigger de Auditoria e Imutabilidade
CREATE OR REPLACE FUNCTION public.handle_priority_status_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Validação de Imutabilidade:
    -- Bloqueia alteração de qualquer coluna com exceção de status (e as preenchidas pelo trigger)
    IF (NEW.customer_code IS DISTINCT FROM OLD.customer_code OR
        NEW.customer_name IS DISTINCT FROM OLD.customer_name OR
        NEW.reason IS DISTINCT FROM OLD.reason OR
        NEW.notes IS DISTINCT FROM OLD.notes OR
        NEW.created_by IS DISTINCT FROM OLD.created_by OR
        NEW.created_at IS DISTINCT FROM OLD.created_at) THEN
        RAISE EXCEPTION 'Operação não permitida: Somente o status pode ser modificado após a criação da prioridade.';
    END IF;

    -- Transição: 'pendente' -> 'aceito'
    IF NEW.status = 'aceito' AND (OLD.status IS DISTINCT FROM 'aceito') THEN
        NEW.accepted_at = now();
        NEW.accepted_by = auth.uid();
    -- Transição: 'aceito' -> 'pendente'
    ELSIF NEW.status = 'pendente' AND (OLD.status IS DISTINCT FROM 'pendente') THEN
        NEW.accepted_at = NULL;
        NEW.accepted_by = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove o trigger caso já exista antes de recriar
DROP TRIGGER IF EXISTS trg_priorities_before_update ON public.priorities;

CREATE TRIGGER trg_priorities_before_update
BEFORE UPDATE ON public.priorities
FOR EACH ROW
EXECUTE FUNCTION public.handle_priority_status_update();

-- 4. Habilitação de Row Level Security (RLS)
ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

-- Remove políticas anteriores se houver
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar prioridades" ON public.priorities;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir prioridades pendentes" ON public.priorities;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar o status da prioridade" ON public.priorities;

-- POLÍTICA 1: SELECT
-- Qualquer usuário autenticado (role authenticated) pode visualizar as prioridades do dia
CREATE POLICY "Usuários autenticados podem visualizar prioridades"
ON public.priorities
FOR SELECT
TO authenticated
USING (true);

-- POLÍTICA 2: INSERT
-- Usuários autenticados podem inserir somente com status 'pendente' e sendo os criadores
CREATE POLICY "Usuários autenticados podem inserir prioridades pendentes"
ON public.priorities
FOR INSERT
TO authenticated
WITH CHECK (
    status = 'pendente'
    AND created_by = auth.uid()
);

-- POLÍTICA 3: UPDATE
-- Usuários autenticados podem alterar o status (o trigger garante que apenas o status seja alterado)
CREATE POLICY "Usuários autenticados podem atualizar o status da prioridade"
ON public.priorities
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- IMPORTANTE: Nenhuma política de DELETE é criada.
-- Ninguém (mesmo autenticado) pode excluir registros via cliente da aplicação.
-- O papel anon não possui NENHUMA política concedida (acesso público totalmente bloqueado).

-- 5. Habilitação de Realtime no Supabase
-- Adiciona a tabela public.priorities à publicação de Realtime
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'priorities'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.priorities;
    END IF;
END $$;

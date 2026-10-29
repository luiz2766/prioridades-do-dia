# Prioridades do Dia - Painel Operacional

Aplicativo web interno corporativo para supervisores e gerentes de vendas cadastrarem e gerenciarem os clientes que são prioridade no dia, com suporte a atualização otimista, sincronização em tempo real (Supabase Realtime) e controle estrito de acesso (RLS e Trigger de imutabilidade).

Baseado no sistema de design **Executive Precision** (Stitch).

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilização:** Tailwind CSS + Design Tokens Executive Precision
- **Formulários & Validação:** react-hook-form + zod
- **Ícones:** lucide-react
- **Notificações:** Sonner (Toasts acessíveis com aria-live)
- **Backend & Auth:** Supabase (PostgreSQL, Row Level Security, Realtime, Auth por e-mail/senha com `@supabase/ssr`)
- **Deploy:** Vercel

---

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos
- Node.js 18.17+ ou superior
- Gerenciador de pacotes `npm` ou `pnpm`

### 2. Instalação das dependências
```bash
npm install
```

### 3. Execução em Modo Desenvolvimento
O projeto conta com fallback automático inteligente para **Modo Mock em memória**. Isso significa que você pode executar imediatamente o aplicativo mesmo antes de criar ou configurar o projeto no Supabase:

```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

---

## 🗄️ Etapa 2: Conexão com o Supabase

Quando estiver pronto para ativar o banco de dados real e autenticação:

### Passo 1: Criar o Projeto no Supabase
1. Acesse [database.new](https://database.new) e crie um novo projeto.
2. Defina o nome (ex: `prioridades-do-dia`) e anote a senha do banco.
3. Escolha uma região próxima (ex: `sa-east-1` - São Paulo).

### Passo 2: Executar o Script SQL
1. No menu lateral do painel Supabase, acesse **SQL Editor**.
2. Clique em **+ New query**.
3. Copie todo o conteúdo do arquivo `supabase/schema.sql` deste projeto e cole no editor.
4. Clique em **Run**.
5. O script criará:
   - A tabela `public.priorities` com checks de validação.
   - Os índices em `created_at` e `status`.
   - O trigger `trg_priorities_before_update` que gerencia `accepted_at` / `accepted_by` e **bloqueia** qualquer edição nas demais colunas.
   - As políticas de segurança **Row Level Security (RLS)** restritas a `authenticated`.
   - A publicação no canal **Realtime** (`supabase_realtime`).

### Passo 3: Criar Usuários e Desativar Cadastros Públicos
1. No menu lateral, acesse **Authentication > Providers > Email**.
2. Desmarque a opção **"Enable sign ups"** (Desativar novos cadastros públicos). Isso garante que somente os gestores cadastrados manualmente pelo administrador terão acesso.
3. Acesse **Authentication > Users** e clique em **Add user > Create user**.
4. Crie os e-mails e senhas dos supervisores (ex: `supervisor@empresa.com`).

### Passo 4: Configurar Variáveis de Ambiente Locais
1. No Supabase, vá em **Project Settings > API**.
2. Copie a **Project URL** e a chave **anon public**.
3. Abra o arquivo `.env.local` na raiz do projeto e preencha:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```
4. Reinicie o servidor com `npm run dev`. Agora o app estará conectado ao banco real e protegido pelo login!

---

## ☁️ Deploy na Vercel

1. Envie o código para o GitHub ou GitLab.
2. Acesse o painel da [Vercel](https://vercel.com) e importe o repositório.
3. Na seção **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`: sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sua chave anônima do Supabase
4. Clique em **Deploy**.
5. Após o deploy, copie o domínio gerado (ex: `https://prioridades-do-dia.vercel.app`).
6. No painel do Supabase, vá em **Authentication > URL Configuration**:
   - Defina o **Site URL** com a URL da Vercel.
   - Adicione `https://seu-dominio.vercel.app/**` em **Redirect URLs**.

---

## 🧪 Checklist de Testes Manuais

- [ ] **1. Bloqueio sem autenticação:** Abra uma aba anônima e tente acessar `http://localhost:3000/`. Você deve ser redirecionado automaticamente para `/login`.
- [ ] **2. Login:** Insira o e-mail e senha de um usuário criado no Supabase. O login deve ser realizado com sucesso e redirecionar para `/`.
- [ ] **3. Cadastro de Prioridade:** Preencha o código do cliente (ex: `CLI-9901`), razão social, selecione o motivo e observação. Clique em "Adicionar prioridade".
  - O botão deve exibir spinner durante o envio.
  - Ao salvar, deve exibir o toast verde de sucesso.
  - O formulário é limpo e o foco retorna ao primeiro campo (`customer_code`).
  - O item surge no topo da lista.
- [ ] **4. Checkbox de Aceite (Atualização Otimista):** Clique no checkbox de aceite da prioridade cadastrada.
  - O status muda instantaneamente de "Pendente" para "Aceito" com badge verde e a linha fica atenuada.
  - No banco de dados, `accepted_at` é gravado com o timestamp atual e `accepted_by` com o UID do usuário.
  - Ao desmarcar, volta para "Pendente" e os campos de aceite são limpos.
- [ ] **5. Teste de Tempo Real (Realtime):** Abra duas janelas do navegador lado a lado (ambas logadas).
  - Em uma janela, cadastre uma nova prioridade ou marque um checkbox.
  - Observe a outra janela atualizar automaticamente sem necessidade de recarregar a página (`F5`).
- [ ] **6. Teste de Imutabilidade do Trigger:** Tente rodar um UPDATE via SQL Editor ou cliente alterando `customer_name` de um registro existente:
  ```sql
  UPDATE public.priorities SET customer_name = 'Nome Alterado' WHERE customer_code = 'CLI-9901';
  ```
  O banco deve rejeitar a operação com o erro: *"Operação não permitida: Somente o status pode ser modificado após a criação da prioridade."*

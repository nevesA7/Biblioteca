# Biblioteca com Supabase + Node.js

Mini projeto que conecta no Supabase de duas formas e faz um CRUD de livros.

## Como rodar

1. Instale o Node.js 22 ou mais novo.
2. No Supabase, abra **SQL Editor**, cole o conteudo de `supabase.sql` e clique em **Run**. Isso cria a tabela `livros`.
3. Copie `.env.example` para `.env` e preencha com os dados do seu projeto Supabase.
4. Instale e rode:
   ```
   npm install
   npm run test:api
   npm run diagnostico
   npm run test:db
   ```

## O que cada arquivo faz

- `livros.js`: CRUD pela API do Supabase (criar, listar, atualizar, apagar).
- `index.js`: conexao direta no PostgreSQL, lista os livros com SQL.
- `diagnostico.js`: ajuda a descobrir por que a conexao falhou (DNS, porta, login).
- `supabase.sql`: cria a tabela e a politica de acesso.

## Erros comuns

- `PGRST205`: a tabela nao existe, rode o `supabase.sql`.
- `42501`: faltou a politica RLS.
- `ECONNRESET` ou timeout: confira host e porta do Session Pooler.
- `password authentication failed`: senha do banco errada.

## Cuidado

Nunca mande o `.env` para ninguem nem suba no Git. A politica do `supabase.sql` libera geral para demonstracao, nao use assim em sistema real.

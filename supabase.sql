-- Rode isso no Supabase: SQL Editor > New query > Run

create table if not exists livros (
  id bigint generated always as identity primary key,
  titulo text not null,
  autor text not null,
  ano int,
  lido boolean not null default false,
  criado_em timestamptz not null default now()
);

-- O Supabase exige RLS (seguranca por linha) para liberar acesso pela API.
alter table livros enable row level security;

-- Politica de DEMONSTRACAO: libera tudo para a chave publicavel.
-- Serve para o trabalho da faculdade. Em sistema real, restrinja por usuario logado.
drop policy if exists "demo livre" on livros;
create policy "demo livre" on livros
  for all
  using (true)
  with check (true);

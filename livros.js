import { supabase } from './supabaseClient.js';

// Cada funcao abaixo e uma operacao do CRUD: criar, ler, atualizar e apagar.

async function criar(livro) {
  const { data, error } = await supabase.from('livros').insert(livro).select().single();
  if (error) throw error;
  return data;
}

async function listar() {
  const { data, error } = await supabase
    .from('livros')
    .select('id, titulo, autor, ano, lido')
    .order('id');
  if (error) throw error;
  return data;
}

async function marcarComoLido(id) {
  const { data, error } = await supabase
    .from('livros')
    .update({ lido: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function apagar(id) {
  const { error } = await supabase.from('livros').delete().eq('id', id);
  if (error) throw error;
}

try {
  console.log('1) Criando livros...');
  const a = await criar({ titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 });
  await criar({ titulo: 'O Cortico', autor: 'Aluisio Azevedo', ano: 1890 });
  console.log('   Criado:', a.titulo);

  console.log('2) Listando...');
  console.table(await listar());

  console.log('3) Marcando "Dom Casmurro" como lido...');
  await marcarComoLido(a.id);
  console.table(await listar());

  console.log('4) Apagando "Dom Casmurro"...');
  await apagar(a.id);
  console.table(await listar());

  console.log('Tudo funcionou!');
} catch (erro) {
  console.error('Erro:', erro.message);
  console.error('Codigo:', erro.code ?? 'nao informado');
  console.error('Dica: PGRST205 = tabela nao existe (rodou o supabase.sql?). 42501 = faltou a politica RLS.');
  process.exitCode = 1;
}

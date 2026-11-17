import { pool } from './db.js';

// Mesma ideia do livros.js, mas conectando direto no PostgreSQL com SQL puro.
try {
  console.log('Testando conexao PostgreSQL...');
  const hora = await pool.query('SELECT NOW() AS horario, current_database() AS banco');
  console.table(hora.rows);

  const livros = await pool.query('SELECT id, titulo, autor, ano, lido FROM livros ORDER BY id');
  console.log('Livros na tabela:');
  console.table(livros.rows);
} catch (erro) {
  console.error('Falha PostgreSQL:', erro.message);
  console.error('Codigo:', erro.code ?? 'nao informado');
  process.exitCode = 1;
} finally {
  await pool.end();
}

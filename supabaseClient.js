import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const chave = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !chave) {
  throw new Error('Configure SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no .env');
}

// Usa a API HTTPS do Supabase, sem abrir conexao direta com o Postgres.
export const supabase = createClient(url, chave, {
  auth: { persistSession: false, autoRefreshToken: false }
});

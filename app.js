// Use somente a chave PUBLICAVEL (sb_publishable_...) ou anon. Nunca a secret/service_role.
const SUPABASE_URL = 'https://xfaxoxohzmrlowzvznvu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GdW7FmRyvluiD_yUXILx_Q_J1LoKB6Y';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    // Converte os cabecalhos para objeto simples (evita o DataCloneError em alguns navegadores)
    fetch: (url, opcoes = {}) => {
      if (opcoes.headers instanceof Headers) {
        opcoes.headers = Object.fromEntries(opcoes.headers.entries());
      }
      return fetch(url, opcoes);
    }
  }
});

const estante = document.getElementById('estante');
const contagem = document.getElementById('contagem');
const msg = document.getElementById('msg');
const detalhe = document.getElementById('detalhe');
const detTitulo = document.getElementById('det-titulo');
const detInfo = document.getElementById('det-info');
const btnLido = document.getElementById('btn-lido');
const btnApagar = document.getElementById('btn-apagar');

// Cores das lombadas (fundo e cor do texto com bom contraste)
const CORES = [
  { bg: '#1f5c63', fg: '#f2f7f6' },
  { bg: '#d9a21b', fg: '#2a1f05' },
  { bg: '#7a2330', fg: '#fbeff1' },
  { bg: '#2c4a8a', fg: '#eef2fb' },
  { bg: '#5b3a6b', fg: '#f6eefa' },
  { bg: '#2f6b4f', fg: '#eef8f2' },
  { bg: '#44546a', fg: '#eef2f7' },
  { bg: '#e8dfc8', fg: '#2b2616' }
];

let livros = [];
let selecionadoId = null;

// Numero "aleatorio" estavel a partir do id, para o livro ter sempre a mesma aparencia
function sorteio(id, n) {
  return ((Number(id) * 2654435761) >>> 0) % n;
}

function aviso(texto, tipo) {
  msg.textContent = texto || '';
  msg.className = 'msg' + (tipo ? ' ' + tipo : '');
}

function atualizarContagem() {
  const total = livros.length;
  const lidos = livros.filter(l => l.lido).length;
  if (!total) {
    contagem.textContent = 'A estante está vazia.';
    return;
  }
  const palavra = total === 1 ? 'livro' : 'livros';
  const lidosTxt = lidos === 1 ? '1 lido' : lidos + ' lidos';
  contagem.textContent = total + ' ' + palavra + ' na estante, ' + lidosTxt + '.';
}

async function carregar() {
  const { data, error } = await db.from('livros').select('*').order('id');
  if (error) {
    contagem.textContent = 'Não foi possível carregar os livros.';
    return aviso('Erro: ' + error.message + '. Confira a URL e a chave no app.js.', 'erro');
  }
  livros = data;
  if (!livros.some(l => l.id === selecionadoId)) selecionadoId = null;
  desenharEstante();
}

function desenharEstante() {
  estante.replaceChildren();
  atualizarContagem();

  if (!livros.length) {
    const vazio = document.createElement('li');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhum livro por aqui ainda. Adicione o primeiro no formulário.';
    estante.appendChild(vazio);
  }

  livros.forEach(livro => {
    const cor = CORES[sorteio(livro.id, CORES.length)];
    const altura = 150 + sorteio(livro.id + 7, 6) * 13;
    const largura = 30 + Math.min(livro.titulo.length, 28) * 0.6 + sorteio(livro.id + 3, 4) * 3;

    const li = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'lombada';
    botao.style.cssText = 'width:' + largura.toFixed(0) + 'px;height:' + altura + 'px;background:' + cor.bg + ';color:' + cor.fg;
    botao.setAttribute('aria-pressed', String(livro.id === selecionadoId));
    botao.setAttribute('aria-label', livro.titulo + ', de ' + livro.autor + (livro.lido ? ', já lido' : ', ainda não lido'));
    botao.title = livro.titulo;

    const nome = document.createElement('span');
    nome.className = 'nome';
    nome.textContent = livro.titulo;
    botao.appendChild(nome);

    if (livro.lido) {
      const marcador = document.createElement('span');
      marcador.className = 'marcador';
      marcador.setAttribute('aria-hidden', 'true');
      botao.appendChild(marcador);
    }

    botao.addEventListener('click', () => {
      selecionadoId = selecionadoId === livro.id ? null : livro.id;
      desenharEstante();
    });

    li.appendChild(botao);
    estante.appendChild(li);
  });

  mostrarDetalhe();
}

function mostrarDetalhe() {
  const livro = livros.find(l => l.id === selecionadoId);
  if (!livro) {
    detalhe.hidden = true;
    return;
  }
  detTitulo.textContent = livro.titulo;
  detInfo.textContent = 'de ' + livro.autor + (livro.ano ? ', ' + livro.ano : '') +
    (livro.lido ? '. Já lido.' : '. Ainda não lido.');
  btnLido.textContent = livro.lido ? 'Marcar como não lido' : 'Marcar como lido';
  detalhe.hidden = false;
}

btnLido.addEventListener('click', async () => {
  const livro = livros.find(l => l.id === selecionadoId);
  if (!livro) return;
  const { error } = await db.from('livros').update({ lido: !livro.lido }).eq('id', livro.id);
  if (error) return aviso('Não foi possível atualizar o livro: ' + error.message, 'erro');
  aviso('');
  carregar();
});

btnApagar.addEventListener('click', async () => {
  const livro = livros.find(l => l.id === selecionadoId);
  if (!livro) return;
  if (!window.confirm('Apagar "' + livro.titulo + '" da estante?')) return;
  const { error } = await db.from('livros').delete().eq('id', livro.id);
  if (error) return aviso('Não foi possível apagar o livro: ' + error.message, 'erro');
  selecionadoId = null;
  aviso('Livro apagado.', 'ok');
  carregar();
});

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const botao = e.target.querySelector('button[type="submit"]');
  const ano = document.getElementById('ano').value;
  const livro = {
    titulo: document.getElementById('titulo').value.trim(),
    autor: document.getElementById('autor').value.trim(),
    ano: ano ? Number(ano) : null
  };
  botao.disabled = true;
  const { error } = await db.from('livros').insert(livro);
  botao.disabled = false;
  if (error) return aviso('Não foi possível adicionar o livro: ' + error.message, 'erro');
  e.target.reset();
  aviso('Livro adicionado à estante.', 'ok');
  carregar();
});

carregar();
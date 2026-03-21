const API = "https://apisamuel.onrender.com/pessoas";

const lista = document.getElementById("lista");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const contador = document.getElementById("contador");
const totalVotos = document.getElementById("totalVotos");
const resultadoSection = document.getElementById("resultado");
const rankingDiv = document.getElementById("ranking");
const searchInput = document.getElementById("searchInput");

let pessoas = [];
let pessoasFiltradas = [];
let index = 0;
let pontuacao = {};
let selecionando = false;
let votos = 0;

// =========================
// CARREGAR PESSOAS
// =========================
async function carregarPessoasJogo() {
  try {
    const res = await fetch(API);

    if (!res.ok) throw new Error("Erro ao buscar dados");

    pessoas = await res.json();
    pessoasFiltradas = [...pessoas];

    resetarJogo();

    pessoas.forEach(p => {
      pontuacao[p.id] = {
        nome: p.nome,
        descricao: p.descricao,
        pontos: 0,
        imagem: p.imagem
      };
    });

    mostrarDupla();

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p>Erro ao carregar dados.</p>";
  }
}

// =========================
// RESET
// =========================
function resetarJogo() {
  pontuacao = {};
  index = 0;
  votos = 0;
  resultadoSection.classList.add("hidden");
  atualizarStatus();
}

// =========================
// STATUS
// =========================
function atualizarStatus() {
  contador.textContent = `Rodada: ${Math.floor(index / 2) + 1}`;
  totalVotos.textContent = `Votos: ${votos}`;
}

// =========================
// MOSTRAR DUPLA
// =========================
function mostrarDupla() {
  lista.innerHTML = "";
  selecionando = false;

  if (index >= pessoasFiltradas.length - 1) {
    mostrarResultado();
    return;
  }

  const p1 = pessoasFiltradas[index];
  const p2 = pessoasFiltradas[index + 1];

  criarCard(p1);
  criarCard(p2);

  atualizarStatus();
}

// =========================
// CRIAR CARD
// =========================
function criarCard(pessoa) {
  const card = document.createElement("div");
  card.classList.add("card");

  const imgUrl = pessoa.imagem
    ? `https://apisamuel.onrender.com/uploads/${pessoa.imagem}`
    : "https://via.placeholder.com/300";

  card.innerHTML = `
    <img src="${imgUrl}" alt="${pessoa.nome}">
    <h2>${pessoa.nome}</h2>
    <p>${pessoa.descricao || "Sem descrição"}</p>
  `;

  card.onclick = () => selecionarPessoa(pessoa, card);

  lista.appendChild(card);
}

// =========================
// SELECIONAR
// =========================
function selecionarPessoa(pessoa, cardClicado) {
  if (selecionando) return;
  selecionando = true;

  votos++;
  pontuacao[pessoa.id].pontos++;

  // destaque
  cardClicado.classList.add("selecionado");

  // fade no outro
  document.querySelectorAll(".card").forEach(card => {
    if (card !== cardClicado) {
      card.classList.add("perdedor");
    }
  });

  atualizarStatus();

  setTimeout(() => {
    index += 2;
    mostrarDupla();
  }, 500);
}

// =========================
// RESULTADO
// =========================
function mostrarResultado() {
  lista.innerHTML = "";
  resultadoSection.classList.remove("hidden");

  const ranking = Object.values(pontuacao)
    .sort((a, b) => b.pontos - a.pontos);

  rankingDiv.innerHTML = "";

  ranking.forEach((p, i) => {
    const item = document.createElement("div");
    item.classList.add("card");

    const imgUrl = p.imagem
      ? `https://apisamuel.onrender.com/uploads/${p.imagem}`
      : "https://via.placeholder.com/300";

    item.innerHTML = `
      <img src="${imgUrl}">
      <h3>${i + 1}º - ${p.nome}</h3>
      <p>${p.descricao || "Sem descrição"}</p>
      <strong>Pontos: ${p.pontos}</strong>
    `;

    rankingDiv.appendChild(item);
  });
}

// =========================
// BUSCA
// =========================
searchInput.addEventListener("input", () => {
  const termo = searchInput.value.toLowerCase();

  pessoasFiltradas = pessoas.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );

  index = 0;
  mostrarDupla();
});

// =========================
// EVENTOS
// =========================
startBtn.addEventListener("click", carregarPessoasJogo);

restartBtn.addEventListener("click", () => {
  carregarPessoasJogo();
});
const popup = document.getElementById("popup");
const btnFechar = document.getElementById("btn_fehar");

// abrir ao carregar a página
window.addEventListener("load", () => {
  setTimeout(() => {
    popup.classList.add("ativo");
  }, 500); // pequeno delay pra ficar mais elegante
});

// fechar ao clicar no botão
btnFechar.addEventListener("click", () => {
  popup.classList.remove("ativo");
});

// fechar clicando fora do conteúdo
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.remove("ativo");
  }
});
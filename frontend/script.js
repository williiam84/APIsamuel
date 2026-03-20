const API = "https://apisamuel.onrender.com/pessoas";

const lista = document.getElementById("lista");
const startBtn = document.getElementById("startBtn");

let pessoas = [];
let index = 0;
let pontuacao = {};
let selecionando = false;

// =========================
// CARREGAR PESSOAS
// =========================
async function carregarPessoasJogo() {
  try {
    const res = await fetch(API);

    if (!res.ok) {
      throw new Error("Erro ao buscar dados");
    }

    pessoas = await res.json();

    pontuacao = {};
    index = 0;

    // inicializa pontuação
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
    console.error("Erro ao buscar pessoas:", error);
    lista.innerHTML = "<p>Erro ao carregar dados.</p>";
  }
}

// =========================
// MOSTRAR DUPLA
// =========================
function mostrarDupla() {
  lista.innerHTML = "";
  selecionando = false;

  if (index >= pessoas.length) {
    mostrarResultado();
    return;
  }

  const p1 = pessoas[index];
  const p2 = pessoas[index + 1];

  if (!p2) {
    mostrarResultado();
    return;
  }

  criarCard(p1);
  criarCard(p2);
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
    <img src="${imgUrl}" />
    <h2>${pessoa.nome}</h2>
    <p>${pessoa.descricao || "Sem descrição"}</p>
  `;

  card.onclick = () => selecionarPessoa(pessoa, card);

  lista.appendChild(card);
}

// =========================
// SELECIONAR PESSOA
// =========================
function selecionarPessoa(pessoa, cardClicado) {
  if (selecionando) return;
  selecionando = true;

  // destaque visual
  cardClicado.style.border = "3px solid #00f2fe";
  cardClicado.style.transform = "scale(1.1)";

  // pontuação
  pontuacao[pessoa.id].pontos += 1;

  // desbotar o outro card
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    if (card !== cardClicado) {
      card.style.opacity = "0.3";
    }
  });

  // próxima rodada
  setTimeout(() => {
    index += 2;
    mostrarDupla();
  }, 600);
}

// =========================
// RESULTADO FINAL
// =========================
function mostrarResultado() {
  lista.innerHTML = "<h2>🏆 Resultado Final</h2>";

  const ranking = Object.values(pontuacao)
    .sort((a, b) => b.pontos - a.pontos);

  ranking.forEach((p, i) => {
    const item = document.createElement("div");
    item.classList.add("card");

    const imgUrl = p.imagem
      ? `https://apisamuel.onrender.com/uploads/${p.imagem}`
      : "https://via.placeholder.com/300";

    item.innerHTML = `
      <img src="${imgUrl}" />
      <h3>${i + 1}º - ${p.nome}</h3>
      <p>${p.descricao || "Sem descrição"}</p>
      <p>Pontos: ${p.pontos}</p>
    `;

    lista.appendChild(item);
  });

  console.log("Ranking:", ranking);
}

// =========================
// INICIAR JOGO
// =========================
startBtn.addEventListener("click", () => {
  carregarPessoasJogo();
});
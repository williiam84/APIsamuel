const API = "https://apisamuel.onrender.com/pessoas";

const form = document.getElementById("form");
const msg = document.getElementById("msg");
const lista = document.getElementById("lista");
const previewImg = document.getElementById("previewImg");
const fileInput = document.getElementById("imagem");

// =========================
// PREVIEW DA IMAGEM
// =========================
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.style.display = "block";
  } else {
    previewImg.style.display = "none";
  }
});

// =========================
// MENSAGEM
// =========================
function mostrarMsg(texto, tipo = "sucesso") {
  msg.innerText = texto;
  msg.style.color = tipo === "erro" ? "red" : "green";

  setTimeout(() => {
    msg.innerText = "";
  }, 3000);
}

// =========================
// CADASTRAR
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const grupo = document.getElementById("grupo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const imagem = fileInput.files[0];

  if (!nome || !descricao) {
    mostrarMsg("Preencha nome e descrição", "erro");
    return;
  }

  if (!imagem) {
    mostrarMsg("Selecione uma imagem", "erro");
    return;
  }

  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("grupo", grupo);
  formData.append("descricao", descricao);
  formData.append("imagem", imagem);

  try {
    const res = await fetch(API, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error();

    mostrarMsg("Pessoa cadastrada com sucesso");

    form.reset();
    previewImg.style.display = "none";

    carregarPessoas();

  } catch (error) {
    console.error(error);
    mostrarMsg("Erro ao cadastrar pessoa", "erro");
  }
});

// =========================
// LISTAR
// =========================
async function carregarPessoas() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();

    const pessoas = await res.json();
    lista.innerHTML = "";

    if (pessoas.length === 0) {
      lista.innerHTML = "<p>Nenhuma pessoa cadastrada</p>";
      return;
    }

    pessoas.forEach(pessoa => {
      const card = criarCardPessoa(pessoa);
      lista.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p>Erro ao carregar dados</p>";
  }
}

// =========================
// CRIAR CARD
// =========================
function criarCardPessoa(pessoa) {
  const card = document.createElement("div");
  card.classList.add("card");

  const imgUrl = pessoa.imagem
    ? `https://apisamuel.onrender.com/uploads/${pessoa.imagem}`
    : "https://via.placeholder.com/150";

  const img = document.createElement("img");
  img.src = imgUrl;

  const nome = document.createElement("h3");
  nome.innerText = pessoa.nome;

  const grupo = document.createElement("p");
  grupo.innerHTML = `<strong>Grupo:</strong> ${pessoa.grupo || "N/A"}`;

  const desc = document.createElement("p");
  desc.innerText = pessoa.descricao || "Sem descrição";

  const btn = document.createElement("button");
  btn.innerText = "Excluir";
  btn.classList.add("btn-delete");

  btn.addEventListener("click", () => confirmarExclusao(pessoa.id));

  card.append(img, nome, grupo, desc, btn);

  return card;
}

// =========================
// CONFIRMAR EXCLUSÃO
// =========================
function confirmarExclusao(id) {
  const confirmar = confirm("Tem certeza que deseja excluir?");

  if (confirmar) {
    deletarPessoa(id);
  }
}

// =========================
// DELETAR
// =========================
async function deletarPessoa(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    mostrarMsg("Pessoa excluída");
    carregarPessoas();

  } catch (error) {
    console.error(error);
    mostrarMsg("Erro ao excluir", "erro");
  }
}

// =========================
// INICIAR
// =========================
carregarPessoas();
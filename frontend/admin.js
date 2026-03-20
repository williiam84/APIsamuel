const form = document.getElementById("form");
const msg = document.getElementById("msg");
const lista = document.getElementById("lista");

const API = "https://apisamuel.onrender.com/pessoas";

// =========================
// CADASTRAR PESSOA
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const grupo = document.getElementById("grupo").value;
  const descricao = document.getElementById("descricao").value;

  const fileInput = document.getElementById("imagem");
  const imagem = fileInput.files[0];

  if (!imagem) {
    msg.innerText = "Selecione uma imagem!";
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

    await res.json();

    msg.innerText = "Pessoa cadastrada com sucesso!";
    form.reset();

    carregarPessoas(); // atualiza lista

  } catch (error) {
    console.error("Erro:", error);
    msg.innerText = "Erro ao cadastrar";
  }
});


// =========================
// LISTAR PESSOAS
// =========================
async function carregarPessoas() {
  try {
    const res = await fetch(API);
    const pessoas = await res.json();

    lista.innerHTML = "";

    pessoas.forEach(pessoa => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${pessoa.imagem 
          ? `https://apisamuel.onrender.com/uploads/${pessoa.imagem}` 
          : 'https://via.placeholder.com/150'}" />
        
        <h3>${pessoa.nome}</h3>

        <p><strong>Grupo:</strong> ${pessoa.grupo || "N/A"}</p>

        <p>${pessoa.descricao || "Sem descrição"}</p>

        <button onclick="deletarPessoa(${pessoa.id})">Excluir</button>
      `;

      lista.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
  }
}


// =========================
// DELETAR PESSOA
// =========================
async function deletarPessoa(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    carregarPessoas();

  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}


// carregar ao abrir admin
carregarPessoas();
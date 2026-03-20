const API = "https://apisamuel.onrender.com/pessoas";

const form = document.getElementById("form");
const msg = document.getElementById("msg");
const lista = document.getElementById("lista");

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

  if (!nome || !descricao) {
    msg.innerText = "Preencha todos os campos!";
    return;
  }

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

    if (!res.ok) {
      throw new Error("Erro na API");
    }

    await res.json();

    msg.innerText = "Pessoa cadastrada com sucesso!";
    msg.style.color = "green";

    form.reset();
    carregarPessoas(); // atualiza lista

  } catch (error) {
    console.error("Erro:", error);
    msg.innerText = "Erro ao cadastrar";
    msg.style.color = "red";
  }
});


// =========================
// LISTAR PESSOAS
// =========================
async function carregarPessoas() {
  try {
    const res = await fetch(API);

    if (!res.ok) {
      throw new Error("Erro ao buscar dados");
    }

    const pessoas = await res.json();

    lista.innerHTML = "";

    pessoas.forEach(pessoa => {
      const card = document.createElement("div");
      card.classList.add("card");

      const imgUrl = pessoa.imagem
        ? `https://apisamuel.onrender.com/uploads/${pessoa.imagem}`
        : "https://via.placeholder.com/150";

      card.innerHTML = `
        <img src="${imgUrl}" />
        
        <h3>${pessoa.nome}</h3>

        <p><strong>Grupo:</strong> ${pessoa.grupo || "N/A"}</p>

        <p>${pessoa.descricao || "Sem descrição"}</p>

        <button onclick="deletarPessoa(${pessoa.id})">Excluir</button>
      `;

      lista.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
    lista.innerHTML = "<p>Erro ao carregar dados</p>";
  }
}


// =========================
// DELETAR PESSOA
// =========================
async function deletarPessoa(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error("Erro ao deletar");
    }

    carregarPessoas();

  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}


// carregar ao abrir admin
carregarPessoas();
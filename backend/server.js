const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// garantir que a pasta uploads existe
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// liberar imagens
app.use("/uploads", express.static("uploads"));

// rotas
const pessoasRoutes = require("./routes/pessoas");
app.use("/pessoas", pessoasRoutes);

// porta (Render / Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
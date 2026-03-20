const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// liberar imagens
app.use("/uploads", express.static("uploads"));

// rotas
const pessoasRoutes = require("./routes/pessoas");
app.use("/pessoas", pessoasRoutes);

// porta (IMPORTANTE pro Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
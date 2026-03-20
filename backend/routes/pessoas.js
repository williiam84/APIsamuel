const express = require("express");
const router = express.Router();
const multer = require("multer");

// configuração do upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// banco fake (por enquanto)
let pessoas = [];

// 🔹 Criar pessoa
router.post("/", upload.single("imagem"), (req, res) => {
    try {
        const { nome, grupo, descricao } = req.body;

        const novaPessoa = {
            id: Date.now(),
            nome,
            grupo,
            descricao,
            imagem: req.file ? req.file.filename : null
        };

        pessoas.push(novaPessoa);

        res.json(novaPessoa);
    } catch (error) {
        console.error("Erro ao criar pessoa:", error);
        res.status(500).json({ erro: "Erro interno ao criar pessoa" });
    }
});

// 🔹 Listar pessoas
router.get("/", (req, res) => {
    try {
        res.json(pessoas);
    } catch (error) {
        console.error("Erro ao listar pessoas:", error);
        res.status(500).json({ erro: "Erro interno ao listar pessoas" });
    }
});

// 🔹 Deletar pessoa
router.delete("/:id", (req, res) => {
    try {
        pessoas = pessoas.filter(p => p.id != req.params.id);
        res.json({ ok: true });
    } catch (error) {
        console.error("Erro ao deletar pessoa:", error);
        res.status(500).json({ erro: "Erro interno ao deletar pessoa" });
    }
});

module.exports = router;
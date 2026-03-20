const express = require("express");
const router = express.Router();
const multer = require("multer");

// configuração do upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// banco fake (por enquanto)
let pessoas = [];

// 🔹 Criar pessoa
router.post("/", upload.single("imagem"), (req, res) => {
    const { nome, grupo } = req.body;

    const novaPessoa = {
        id: Date.now(),
        nome,
        grupo,
        descricao,
        imagem: req.file ? req.file.filename : null
    };

    pessoas.push(novaPessoa);

    res.json(novaPessoa);
});

// 🔹 Listar pessoas
router.get("/", (req, res) => {
    res.json(pessoas);
});

// 🔹 Deletar pessoa
router.delete("/:id", (req, res) => {
    pessoas = pessoas.filter(p => p.id != req.params.id);
    res.json({ ok: true });
});

module.exports = router;
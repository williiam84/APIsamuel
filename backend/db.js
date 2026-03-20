const mysql = require("mysql2");

// conexão
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "NovaSenhaSegura", // sua senha
    database: "pessoas_db"
});

connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }
    console.log("Conectado ao MySQL 🚀");
});

module.exports = connection;
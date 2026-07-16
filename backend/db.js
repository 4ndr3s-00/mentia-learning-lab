// aqui vive la conexion a postgres, todo el backend pide datos a traves de este archivo
require("dotenv").config();
const { Pool } = require("pg");

// el pool es como una bolsa de conexiones listas para usar, mas rapido que abrir una nueva cada vez
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// funcion unica para hacer cualquier consulta sql (texto + valores) y recibir las filas
async function query(texto, valores) {
  const resultado = await pool.query(texto, valores);
  return resultado.rows;
}

module.exports = { query };

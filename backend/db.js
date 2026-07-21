require("dotenv").config();
const { Pool } = require("pg");


const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// funcion unica para hacer cualquier consulta sql (texto + valores) y recibir las filas
async function query(texto, valores) {
  const resultado = await pool.query(texto, valores);
  return resultado.rows;
}

module.exports = { query };

require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// convierte una contraseña normal en un texto encriptado, para guardarla segura en la bd
function encriptarContrasena(contrasena) {
  return bcrypt.hashSync(contrasena, 10);
}

// compara la contraseña escrita contra la guardada
function compararContrasena(contrasenaEscrita, contrasenaGuardada) {
  const estaEncriptada = contrasenaGuardada.startsWith("$2");
  return estaEncriptada
    ? bcrypt.compareSync(contrasenaEscrita, contrasenaGuardada)
    : contrasenaEscrita === contrasenaGuardada;
}

// crea el token que el usuario usara para probar que ya inicio sesion
function crearToken(idUsuario) {
  return jwt.sign({ idUsuario }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// revisa el token que viene en la peticion antes de dejar pasar a una ruta protegida
function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization || "";
  const token = encabezado.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No hay sesion iniciada." });
  }

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.idUsuario = datos.idUsuario;
    next();
  } catch {
    return res.status(401).json({ error: "Sesion invalida o vencida." });
  }
}

module.exports = { encriptarContrasena, compararContrasena, crearToken, verificarToken };

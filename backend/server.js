require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");
const auth = require("./auth");
const ia = require("./ia");

const app = express();
app.use(cors()); // deja que el frontend le hable a este backend
app.use(express.json()); // permite leer json en el body de las peticiones


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// multer guarda el archivo subido en memoria (no en disco) para poder reenviarlo a la ia y guardarlo nosotros
const subirArchivo = multer({ storage: multer.memoryStorage() });

// el frontend manda "JavaScript" pero la base de datos solo acepta "Javascript" (entre otros) - aqui se arregla
const LENGUAJES_VALIDOS = { python: "Python", javascript: "Javascript", java: "Java", html: "HTML", css: "CSS" };
function normalizarLenguaje(lenguaje) {
  return LENGUAJES_VALIDOS[String(lenguaje).toLowerCase()] || lenguaje;
}

// revisa que el servidor esta vivo
app.get("/api/estado", (req, res) => res.json({ estado: "ok" }));

// ---------- login y registro ----------

// crea un usuario nuevo con su contraseña ya encriptada
app.post("/api/auth/register", async (req, res) => {
  const { nombre_completo, contrasena } = req.body;
  const correo = req.body.correo ? String(req.body.correo).trim().toLowerCase() : req.body.correo;

  if (!nombre_completo || !correo || !contrasena) {
    return res.status(400).json({ error: "Faltan datos: nombre, correo o contraseña." });
  }

  const yaExiste = await db.query("select id_usuario from usuario where lower(correo) = $1", [correo]);
  if (yaExiste.length > 0) {
    return res.status(409).json({ error: "Ese correo ya esta registrado." });
  }

  const contrasenaEncriptada = auth.encriptarContrasena(contrasena);
  const creados = await db.query(
    "insert into usuario (nombre_completo, correo, contrasena) values ($1, $2, $3) returning id_usuario, nombre_completo, correo",
    [nombre_completo, correo, contrasenaEncriptada]
  );
  const usuario = creados[0];

  res.status(201).json({ token: auth.crearToken(usuario.id_usuario), usuario });
});

// revisa correo jumto con contraseña y entrega un token de sesion
app.post("/api/auth/login", async (req, res) => {
  const { contrasena } = req.body;
  const correo = req.body.correo ? String(req.body.correo).trim().toLowerCase() : req.body.correo;

  const encontrados = await db.query("select * from usuario where lower(correo) = $1", [correo]);
  if (encontrados.length === 0) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const usuario = encontrados[0];
  if (!auth.compararContrasena(contrasena, usuario.contrasena)) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  res.json({
    token: auth.crearToken(usuario.id_usuario),
    usuario: { id_usuario: usuario.id_usuario, nombre_completo: usuario.nombre_completo, correo: usuario.correo },
  });
});

// edita el nombre, correo y (si escriben una nueva) la contraseña del usuario que inicio sesion
app.put("/api/usuario", auth.verificarToken, async (req, res) => {
  const { nombre_completo, contrasena } = req.body;
  const correo = req.body.correo ? String(req.body.correo).trim().toLowerCase() : req.body.correo;

  if (!nombre_completo || !correo) {
    return res.status(400).json({ error: "Faltan datos: nombre o correo." });
  }

  const yaExiste = await db.query(
    "select id_usuario from usuario where lower(correo) = $1 and id_usuario != $2",
    [correo, req.idUsuario]
  );
  if (yaExiste.length > 0) {
    return res.status(409).json({ error: "Ese correo ya lo esta usando otra cuenta." });
  }

  try {
    if (contrasena && contrasena.trim()) {
      await db.query(
        "update usuario set nombre_completo = $1, correo = $2, contrasena = $3 where id_usuario = $4",
        [nombre_completo, correo, auth.encriptarContrasena(contrasena), req.idUsuario]
      );
    } else {
      await db.query(
        "update usuario set nombre_completo = $1, correo = $2 where id_usuario = $3",
        [nombre_completo, correo, req.idUsuario]
      );
    }
  } catch {
    return res.status(409).json({ error: "Ese correo ya lo esta usando otra cuenta." });
  }

  res.json({ usuario: { id_usuario: req.idUsuario, nombre_completo, correo } });
});

// ---------- test diagnostico ----------

// trae el resultado guardado del test diagnostico del usuario o todo null si no lo ha hecho
app.get("/api/usuario/diagnostico", auth.verificarToken, async (req, res) => {
  const filas = await db.query(
    "select puntaje_visual, puntaje_auditivo, puntaje_kinestesico, perfil_aprendizaje, fecha_diagnostico from usuario where id_usuario = $1",
    [req.idUsuario]
  );
  res.json(filas[0]);
});

// guarda el resultado del test diagnostico que el estudiante acaba de responder
app.put("/api/usuario/diagnostico", auth.verificarToken, async (req, res) => {
  const { puntaje_visual, puntaje_auditivo, puntaje_kinestesico, perfil_aprendizaje } = req.body;

  try {
    await db.query(
      `update usuario set puntaje_visual = $1, puntaje_auditivo = $2, puntaje_kinestesico = $3,
       perfil_aprendizaje = $4, fecha_diagnostico = now() where id_usuario = $5`,
      [puntaje_visual, puntaje_auditivo, puntaje_kinestesico, perfil_aprendizaje, req.idUsuario]
    );
  } catch {
    return res.status(400).json({ error: "No se pudo guardar el resultado del test." });
  }

  res.json({ puntaje_visual, puntaje_auditivo, puntaje_kinestesico, perfil_aprendizaje });
});

// ---------- actividades ----------

// el estudiante sube una actividad y se manda a analizar con ia
app.post("/api/actividades", auth.verificarToken, subirArchivo.single("archivo"), async (req, res) => {
  const { nombre_proyecto, codigo } = req.body;
  const lenguaje = normalizarLenguaje(req.body.lenguaje);
  const archivo = req.file;

  if (!nombre_proyecto || !lenguaje) {
    return res.status(400).json({ error: "Faltan datos: nombre del proyecto o lenguaje." });
  }

  // si subieron un archivo, se guarda en la carpeta uploads para poder verlo despues
  let nombreArchivoGuardado = null;
  if (archivo) {
    nombreArchivoGuardado = `${Date.now()}-${archivo.originalname}`;
    fs.writeFileSync(path.join(__dirname, "uploads", nombreArchivoGuardado), archivo.buffer);
  }

  const creadas = await db.query(
    `insert into actividad (nombre_proyecto, lenguaje, codigo, archivo, estado, id_usuario)
     values ($1, $2, $3, $4, 'analizando', $5) returning *`,
    [nombre_proyecto, lenguaje, codigo || null, nombreArchivoGuardado, req.idUsuario]
  );
  const actividad = creadas[0];

  try {
    const { analisis, planEstudio, temas } = await ia.analizarYGuardar(
      actividad.id_actividad,
      nombre_proyecto,
      lenguaje,
      codigo,
      archivo
    );

    await db.query("update actividad set estado = 'completado' where id_actividad = $1", [actividad.id_actividad]);
    actividad.estado = "completado";

    res.status(201).json({ actividad, analisis, planEstudio, temas });
  } catch (error) {
    res.status(502).json({ error: error.message, actividad });
  }
});

// lista todas las actividades del usuario que inicio sesion, con su analisis si ya lo tienen
app.get("/api/actividades", auth.verificarToken, async (req, res) => {
  const actividades = await db.query(
    `select a.*, an.puntaje
     from actividad a
     left join analisis an on an.id_actividad = a.id_actividad
     where a.id_usuario = $1
     order by a.fecha_subida desc`,
    [req.idUsuario]
  );
  res.json(actividades);
});

// trae una actividad especifica con su analisis y plan de estudio completos
app.get("/api/actividades/:id", auth.verificarToken, async (req, res) => {
  const actividades = await db.query(
    "select * from actividad where id_actividad = $1 and id_usuario = $2",
    [req.params.id, req.idUsuario]
  );
  if (actividades.length === 0) {
    return res.status(404).json({ error: "Actividad no encontrada." });
  }
  const actividad = actividades[0];

  const analisisEncontrados = await db.query("select * from analisis where id_actividad = $1", [actividad.id_actividad]);
  const analisis = analisisEncontrados[0] || null;

  let planEstudio = null;
  let temas = [];
  if (analisis) {
    const planes = await db.query("select * from plan_estudio where id_analisis = $1", [analisis.id_analisis]);
    planEstudio = planes[0] || null;

    if (planEstudio) {
      temas = await db.query(
        `select t.* from tema t
         inner join plan_tema pt on pt.id_tema = t.id_tema
         where pt.id_plan_estudio = $1`,
        [planEstudio.id_plan_estudio]
      );
    }
  }

  // arma la url publica de la imagen/archivo subido, si es que hay uno
  const archivoUrl = actividad.archivo ? `/uploads/${actividad.archivo}` : null;

  res.json({ actividad, archivoUrl, analisis, planEstudio, temas });
});

// ---------- dashboard ----------

// resumen para la pantalla principal: cuantas actividades hay, cual es la ultima, y el estado del plan
app.get("/api/dashboard", auth.verificarToken, async (req, res) => {
  const conteos = await db.query(
    `select count(*)::int as subidas, count(an.id_analisis)::int as analizadas
     from actividad a
     left join analisis an on an.id_actividad = a.id_actividad
     where a.id_usuario = $1`,
    [req.idUsuario]
  );

  const ultimas = await db.query(
    `select a.*, an.puntaje, an.id_analisis
     from actividad a
     left join analisis an on an.id_actividad = a.id_actividad
     where a.id_usuario = $1
     order by a.fecha_subida desc
     limit 1`,
    [req.idUsuario]
  );

  res.json({
    subidas: conteos[0].subidas,
    analizadas: conteos[0].analizadas,
    ultimaActividad: ultimas[0] || null,
    planActivo: Boolean(ultimas[0] && ultimas[0].id_analisis),
  });
});

// ---------- servir el frontend ----------

const CARPETA_FRONTEND = path.join(__dirname, "..", "frontend");

app.use(express.static(CARPETA_FRONTEND)); 
app.use("/img", express.static(path.join(CARPETA_FRONTEND, "public", "img"))); 

// cualquier ruta que no sea de la api o de archivos subidos, se manda al index.html 
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
  res.sendFile(path.join(CARPETA_FRONTEND, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mentia corriendo en http://localhost:${PORT}`));

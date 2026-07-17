require("dotenv").config();
const db = require("./db");


const EXTENSION_POR_LENGUAJE = { Python: "py", Java: "java", Javascript: "js", HTML: "html", CSS: "css" };

// revisa si el archivo subido es una imagen 
function esImagen(mimetype) {
  return Boolean(mimetype && mimetype.startsWith("image/"));
}

// le pregunta a ia-analisis (gemini) que analice el codigo y devuelve su respuesta ya interpretada
async function pedirAnalisisIA(nombreProyecto, lenguaje, codigo, archivo) {
  const formData = new FormData();
  formData.append("titulo", nombreProyecto);
  formData.append("lenguaje", lenguaje);

  // si subieron un archivo de codigo (no una imagen), se manda tal cual
  if (archivo && !esImagen(archivo.mimetype)) {
    formData.append("archivos", new Blob([archivo.buffer]), archivo.originalname);
  } else if (codigo && codigo.trim()) {
    // si no, se arma un archivo de texto con lo que el estudiante escribio en el editor
    const extension = EXTENSION_POR_LENGUAJE[lenguaje] || "txt";
    formData.append("archivos", new Blob([codigo]), `codigo.${extension}`);
  } else {
    throw new Error("Escribe codigo en el editor o sube un archivo de codigo para poder analizarlo.");
  }

  const respuesta = await fetch(process.env.IA_ANALISIS_URL, { method: "POST", body: formData });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.detail || "El servicio de IA no pudo analizar la actividad.");
  }

  return datos;
}

// arma un texto de duracion segun cuantas debilidades encontro la ia (mientras mas debilidades, mas tiempo)
function calcularDuracion(cantidadDebilidades) {
  if (cantidadDebilidades <= 2) return "1 semana";
  if (cantidadDebilidades <= 4) return "2 semanas";
  return "3 semanas";
}

// busca un tema por nombre y si no existe lo crea, para no duplicar temas repetidos
async function obtenerOCrearTema(nombre, descripcion) {
  const existentes = await db.query("select id_tema from tema where nombre = $1", [nombre]);
  if (existentes.length > 0) return existentes[0].id_tema;

  const creados = await db.query(
    "insert into tema (nombre, descripcion) values ($1, $2) returning id_tema",
    [nombre, descripcion]
  );
  return creados[0].id_tema;
}

// funcion principal: pide el analisis a la ia y guarda analisis, plan de estudio y temas en la bd
async function analizarYGuardar(idActividad, nombreProyecto, lenguaje, codigo, archivo) {
  const resultado = await pedirAnalisisIA(nombreProyecto, lenguaje, codigo, archivo);

  const fortalezas = resultado.fortalezas || [];
  const debilidades = resultado.debilidades || [];
  const sugerencias = resultado.sugerencias || [];

  // guarda lo que la ia encontro en la tabla analisis
  const analisisCreado = await db.query(
    `insert into analisis (puntaje, resumen, fortalezas, aspectos_mejorar, recomendacion, id_actividad)
     values ($1, $2, $3, $4, $5, $6) returning *`,
    [
      resultado.puntaje,
      resultado.resumen,
      fortalezas.join("\n"),
      debilidades.join("\n") || "No se encontraron aspectos importantes por mejorar.",
      sugerencias.join("\n") || "Continua practicando y explorando temas mas avanzados.",
      idActividad,
    ]
  );
  const analisis = analisisCreado[0];

  // arma el plan de estudio a partir de las debilidades y sugerencias
  const objetivo = debilidades.length > 0
    ? `Reforzar lo siguiente: ${debilidades.join("; ")}`
    : "Continuar practicando y explorar temas mas avanzados.";

  const planCreado = await db.query(
    `insert into plan_estudio (objetivo, duracion, recomendacion_general, id_analisis)
     values ($1, $2, $3, $4) returning *`,
    [objetivo, calcularDuracion(debilidades.length), sugerencias.join(" ") || objetivo, analisis.id_analisis]
  );
  const planEstudio = planCreado[0];

  // cada debilidad se vuelve un tema de estudio 
  const debilidadesParaTemas = debilidades.length > 0 ? debilidades : ["Buenas practicas avanzadas"];
  const temas = [];

  for (const debilidad of debilidadesParaTemas) {
    const nombreTema = debilidad.length > 60 ? debilidad.slice(0, 60) + "..." : debilidad;
    const idTema = await obtenerOCrearTema(nombreTema, debilidad);
    await db.query("insert into plan_tema (id_plan_estudio, id_tema) values ($1, $2)", [planEstudio.id_plan_estudio, idTema]);
    temas.push({ id_tema: idTema, nombre: nombreTema, descripcion: debilidad });
  }

  return { analisis, planEstudio, temas };
}

module.exports = { analizarYGuardar, esImagen };

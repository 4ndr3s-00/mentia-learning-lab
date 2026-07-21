// vacio a proposito: el backend ahora sirve el frontend, asi que todo queda en el mismo origen
const API_URL = "";

// si el usuario no hace nada por este tiempo, se cierra la sesion sola
const INACTIVIDAD_MAXIMA_MS = 30 * 60 * 1000;

// guarda el token y los datos del usuario en el navegador, para recordar la sesion
function guardarSesion(token, usuario) {
  localStorage.setItem("mentia_token", token);
  localStorage.setItem("mentia_usuario", JSON.stringify(usuario));
  registrarActividad();
}

// lee el token guardado (o null si no hay sesion)
export function obtenerToken() {
  return localStorage.getItem("mentia_token");
}

// lee los datos del usuario guardados (o null si no hay sesion)
export function obtenerUsuario() {
  const datos = localStorage.getItem("mentia_usuario");
  return datos ? JSON.parse(datos) : null;
}

// borra la sesion guardada (cerrar sesion)
export function cerrarSesion() {
  localStorage.removeItem("mentia_token");
  localStorage.removeItem("mentia_usuario");
  localStorage.removeItem("mentia_ultima_actividad");
}

// marca "ahora" como el ultimo momento en que el usuario hizo algo (click, teclas, navegacion)
export function registrarActividad() {
  localStorage.setItem("mentia_ultima_actividad", Date.now().toString());
}

// true si paso mas de 30 minutos desde la ultima actividad registrada
export function sesionExpirada() {
  const ultimaActividad = localStorage.getItem("mentia_ultima_actividad");
  if (!ultimaActividad) return false;
  return Date.now() - Number(ultimaActividad) > INACTIVIDAD_MAXIMA_MS;
}

// entra con correo y contraseña, guarda la sesion si funciona
export async function login(correo, contrasena) {
  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo iniciar sesion.");
  guardarSesion(datos.token, datos.usuario);
  return datos.usuario;
}

// crea una cuenta nueva y guarda la sesion si funciona
export async function registrar(nombreCompleto, correo, contrasena) {
  const respuesta = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_completo: nombreCompleto, correo, contrasena }),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo crear la cuenta.");
  guardarSesion(datos.token, datos.usuario);
  return datos.usuario;
}

// actualiza el nombre/correo (y la contraseña, si escribieron una nueva) del usuario que inicio sesion
export async function actualizarPerfil(nombreCompleto, correo, contrasena) {
  const respuesta = await fetch(`${API_URL}/api/usuario`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${obtenerToken()}` },
    body: JSON.stringify({ nombre_completo: nombreCompleto, correo, contrasena }),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo actualizar el perfil.");
  localStorage.setItem("mentia_usuario", JSON.stringify(datos.usuario));
  return datos.usuario;
}

// pide el resultado guardado del test diagnostico (estilo de aprendizaje)
export async function obtenerDiagnostico() {
  const respuesta = await fetch(`${API_URL}/api/usuario/diagnostico`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return respuesta.json();
}

// guarda el resultado del test diagnostico que el estudiante acaba de responder
export async function guardarDiagnostico(resultado) {
  const respuesta = await fetch(`${API_URL}/api/usuario/diagnostico`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${obtenerToken()}` },
    body: JSON.stringify(resultado),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo guardar el resultado del test.");
  return datos;
}

// pide el resumen del dashboard (cuantas actividades, ultima actividad, etc)
export async function obtenerDashboard() {
  const respuesta = await fetch(`${API_URL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return respuesta.json();
}

// pide la lista de todas las actividades del usuario
export async function obtenerActividades() {
  const respuesta = await fetch(`${API_URL}/api/actividades`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return respuesta.json();
}

// pide una actividad especifica con su analisis y plan de estudio
export async function obtenerActividad(id) {
  const respuesta = await fetch(`${API_URL}/api/actividades/${id}`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return respuesta.json();
}

// sube una actividad nueva (nombre, lenguaje, codigo y/o archivo) para que la ia la analice
export async function crearActividad(formData) {
  const respuesta = await fetch(`${API_URL}/api/actividades`, {
    method: "POST",
    headers: { Authorization: `Bearer ${obtenerToken()}` },
    body: formData,
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || "No se pudo analizar la actividad.");
  return datos;
}

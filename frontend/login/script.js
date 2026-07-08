// Funcionalidad simple de registro e inicio de sesion
// Los usuarios se guardan en el localStorage del navegador
// (esto es solo para pruebas, no es una base de datos real)

// clave donde se guarda la lista de usuarios
const CLAVE_USUARIOS = "mentia_usuarios";

// trae la lista de usuarios guardados, o una lista vacia si no hay nada
function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : [];
}

// guarda la lista de usuarios en el localStorage
function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// ----- REGISTRO -----
const formRegistro = document.getElementById("form-registro");

if (formRegistro) {
    formRegistro.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const contrasena = document.getElementById("contrasena").value;
        const mensajeError = document.getElementById("mensaje-error");

        const usuarios = obtenerUsuarios();

        // revisa si ya existe un usuario con ese correo
        const yaExiste = usuarios.some((usuario) => usuario.correo === correo);

        if (yaExiste) {
            mensajeError.textContent = "Ya existe una cuenta con ese correo.";
            return;
        }

        // agrega el nuevo usuario a la lista y la guarda
        usuarios.push({ nombre, correo, contrasena });
        guardarUsuarios(usuarios);

        alert("Cuenta creada. Ahora puedes iniciar sesion.");
        window.location.href = "login.html";
    });
}

// ----- LOGIN -----
const formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const contrasena = document.getElementById("contrasena").value;
        const mensajeError = document.getElementById("mensaje-error");

        const usuarios = obtenerUsuarios();

        // busca un usuario con el mismo correo y contrasena
        const usuario = usuarios.find(
            (usuario) => usuario.correo === correo && usuario.contrasena === contrasena
        );

        if (!usuario) {
            mensajeError.textContent = "Correo o contraseña incorrectos.";
            return;
        }

        // guarda quien es el usuario que inicio sesion
        localStorage.setItem("mentia_sesion", JSON.stringify(usuario));

        alert("Bienvenido(a) " + usuario.nombre);
        // aqui puedes redirigir al dashboard cuando lo tengas listo
    });
}

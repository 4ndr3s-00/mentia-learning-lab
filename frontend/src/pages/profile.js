import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { obtenerUsuario, actualizarPerfil } from "../api.js";

const profile = {

    render() {

        const usuario = obtenerUsuario();

        return `

            <div class="min-h-screen bg-gray-100 lg:flex">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Editar perfil",
                        "Actualiza tus datos personales."
                    )}

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-8 max-w-xl">

                        <p id="profile-message" class="hidden text-center rounded-xl py-3 px-4 mb-6 text-sm"></p>

                        <form id="profile-form">

                            <label class="block text-sm font-semibold text-gray-500 uppercase mb-2">
                                Nombre completo
                            </label>
                            <input id="profile-nombre" type="text" value="${usuario?.nombre_completo || ""}"
                                class="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 mb-6">

                            <label class="block text-sm font-semibold text-gray-500 uppercase mb-2">
                                Correo electrónico
                            </label>
                            <input id="profile-correo" type="email" value="${usuario?.correo || ""}"
                                class="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 mb-6">

                            <label class="block text-sm font-semibold text-gray-500 uppercase mb-2">
                                Nueva contraseña (déjalo vacío para no cambiarla)
                            </label>
                            <input id="profile-contrasena" type="password" placeholder="••••••••"
                                class="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 mb-8">

                            <button id="profile-button" type="submit" class="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl text-lg font-medium transition">
                                Guardar cambios
                            </button>

                        </form>

                    </section>

                </main>

            </div>

        `;

    },

    mounted() {

        sidebar.mounted();

        const form = document.getElementById("profile-form");
        const mensaje = document.getElementById("profile-message");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nombreCompleto = document.getElementById("profile-nombre").value.trim();
            const correo = document.getElementById("profile-correo").value.trim();
            const contrasena = document.getElementById("profile-contrasena").value;

            try {
                await actualizarPerfil(nombreCompleto, correo, contrasena);
                mensaje.textContent = "Tus datos se guardaron correctamente.";
                mensaje.className = "text-center rounded-xl py-3 px-4 mb-6 text-sm bg-green-50 text-green-700";
                document.getElementById("profile-contrasena").value = "";
            } catch (error) {
                mensaje.textContent = error.message;
                mensaje.className = "text-center rounded-xl py-3 px-4 mb-6 text-sm bg-red-50 text-red-600";
            }
        });

    }

};

export default profile;

import { navigate } from "../router.js";
import { cerrarSesion } from "../api.js";

const sidebar = {

    render() {

        return `

            <!-- Botón menú móvil -->

            <button id="menu-button" class="fixed top-5 left-5 z-[60] lg:hidden w-11 h-11 rounded-xl bg-[#6c4ef6] text-white shadow-lg">

                <i class="fa-solid fa-bars"></i>

            </button>

            <div id="sidebar-overlay" class="hidden fixed inset-0 bg-black/40 z-40 lg:hidden"></div>

            <!-- Sidebar -->

            <aside id="sidebar" class="fixed lg:sticky lg:top-0 top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 -translate-x-full lg:translate-x-0 transition-transform duration-300">

                <!-- Logo -->

                <div class="flex items-center gap-4 mb-10">

                    <div class="w-10 h-10 rounded-xl flex items-center justify-center">

                        <img src="/img/logo-mentia.png">

                    </div>

                    <div>

                        <img src="/img/mentia.png" width="100">

                        <span class="text-sm text-gray-500">

                            Academic Mentor

                        </span>

                    </div>

                </div>

                <!-- Botón principal -->

                <button id="chat-button" class="w-full bg-[#6c4ef6] hover:bg-violet-700 text-white rounded-xl py-3 font-medium transition mb-8">

                    <i class="fa-solid fa-upload mr-2"></i>

                    Subir ahora

                </button>

                <!-- Navegación -->

                <nav class="flex flex-col gap-2 flex-1">

                    <a href="" id="dashboard-link"  class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-house"></i>

                        <span>Dashboard</span>

                    </a>

                    <a href="" id="upload-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-file-arrow-up"></i>

                        <span>Subir actividad</span>

                    </a>

                    <a href="" id="analysis-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-microchip"></i>

                        <span>Análisis IA</span>

                    </a>

                    <a href="" id="study-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-regular fa-clipboard"></i>

                        <span>Plan de estudio</span>

                    </a>

                    <a href="" id="activities-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-regular fa-folder-open"></i>

                        <span>Mis actividades</span>

                    </a>

                    <a href="" id="diagnostic-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-clipboard-question"></i>

                        <span>Test diagnóstico</span>

                    </a>

                    <a href="" id="profile-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-user-gear"></i>

                        <span>Editar perfil</span>

                    </a>

                    <a href="" id="logout-link" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition">

                        <i class="fa-solid fa-right-from-bracket"></i>

                        <span>Cerrar sesión</span>

                    </a>

                </nav>

                <!-- Ayuda -->

                <div class="mt-6 flex items-center gap-3 text-gray-500">

                    <i class="fa-regular fa-circle-question"></i>

                    <span>Ayuda</span>

                </div>

            </aside>

        `;

    },

    mounted() {

        const sidebarElement = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebar-overlay");
        const menuButton = document.getElementById("menu-button");

        function closeSidebar() {

            if (window.innerWidth < 1024) {

                sidebar.classList.add("-translate-x-full");
                overlay.classList.add("hidden");

            }

        }

        menuButton?.addEventListener("click", () => {

            sidebarElement.classList.remove("-translate-x-full");

            overlay.classList.remove("hidden");

        });

        overlay?.addEventListener("click", closeSidebar);

        document.getElementById("dashboard-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/dashboard");

            closeSidebar();

        });

        document.getElementById("upload-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/upload");

            closeSidebar();

        });

        document.getElementById("analysis-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/activities");

            closeSidebar();

        });

        document.getElementById("study-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/activities");

            closeSidebar();

        });

        document.getElementById("activities-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/activities");

            closeSidebar();

        });

        document.getElementById("profile-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/profile");

            closeSidebar();

        });

        document.getElementById("diagnostic-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/diagnostic");

            closeSidebar();

        });

        document.getElementById("chat-button")?.addEventListener("click", (event) => {

            event.preventDefault();

            navigate("/upload");

            closeSidebar();

        });

        document.getElementById("logout-link")?.addEventListener("click", (event) => {

            event.preventDefault();

            cerrarSesion();

            navigate("/");

            closeSidebar();

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth >= 1024) {

                sidebar.classList.remove("-translate-x-full");
                overlay.classList.add("hidden");

            } else {

                sidebar.classList.add("-translate-x-full");

            }

        });

    }

};

export default sidebar;
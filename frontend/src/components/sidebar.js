import { navigate } from "../router.js";

const sidebar = {

    render() {

        return `

            <aside class="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col p-6">

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

                <!-- Botón IA -->

                <button id="chat-button" class="w-full bg-[#6c4ef6] hover:bg-violet-700 text-white rounded-xl py-3 font-medium transition mb-8">
                    <i class="fa-regular fa-message mr-2"></i>
                    Subir ahora
                </button>

                <!-- Navegación -->

                <nav class="flex flex-col gap-2">

                    <a href="" id="dashboard-link"
                       class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-house"></i>

                        <span>Dashboard</span>

                    </a>

                    <a href="" id="upload-link"
                       class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-file-arrow-up"></i>

                        <span>Subir actividad</span>

                    </a>

                    <a href="" id="analysis-link"
                       class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-microchip"></i>

                        <span>Análisis IA</span>

                    </a>

                    <a href="" id="study-link"
                       class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-regular fa-clipboard"></i>

                        <span>Plan de estudio</span>

                    </a>


                    <a href="" id="activities-link"
                       class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-regular fa-folder-open"></i>

                        <span>Mis actividades</span>

                    </a>


                    <a href="" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition">

                        <i class="fa-solid fa-gear"></i>

                        <span>Ajustes</span>

                    </a>

                </nav>

                <!-- Ayuda -->

                <div class="mt-auto flex items-center gap-3 text-gray-500">

                    <i class="fa-regular fa-circle-question"></i>

                    <span>Ayuda</span>

                </div>

            </aside>

        `;

    },

    mounted() {

        document.getElementById("dashboard-link")?.addEventListener("click", 
            function (event) { event.preventDefault(); navigate("/dashboard");
        });

        document.getElementById("upload-link")?.addEventListener("click", 
            function (event) {event.preventDefault(); navigate("/upload");
        });

        document.getElementById("analysis-link")?.addEventListener("click", 
            function (event) { event.preventDefault(); navigate("/analysis");
        });

        document.getElementById("study-link")?.addEventListener("click", 
            function (event){ event.preventDefault(); navigate("/study-plan");
        });

        document.getElementById("activities-link")?.addEventListener("click",
            function (event) {event.preventDefault(); navigate("/activities");
        });

        document.getElementById("chat-button")?.addEventListener("click", (event) => { event.preventDefault();
            navigate("/upload");
        });

    }

};

export default sidebar;
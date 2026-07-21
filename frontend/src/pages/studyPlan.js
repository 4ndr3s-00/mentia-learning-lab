import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";
import { obtenerActividad, obtenerActividades } from "../api.js";

const studyPlan = {

    render() {

        return `

            <div class="min-h-screen bg-gray-100 lg:flex">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Plan de estudio",
                        "Generado a partir del análisis más reciente de tu actividad."
                    )}

                    <section id="activity-picker-section" class="bg-white rounded-2xl shadow-sm p-6 mt-8">

                        <label for="activity-picker" class="block mb-3 text-gray-600 font-medium">
                            Elige el código que quieres ver:
                        </label>

                        <select id="activity-picker" class="w-full sm:w-auto border border-gray-300 rounded-xl px-4 py-3 outline-none"></select>

                    </section>

                    <section id="study-plan-content" class="hidden">

                        <!-- Objetivo -->

                        <section class="bg-white rounded-2xl shadow-sm p-6 mt-8">

                            <div class="flex items-center gap-3 mb-4">

                                <i class="fa-solid fa-bullseye text-2xl text-violet-600"></i>

                                <h2 class="text-xl font-semibold text-gray-800">
                                    Objetivo del plan
                                </h2>

                            </div>

                            <p id="plan-goal" class="text-gray-600 leading-7"></p>

                            <div class="mt-6 inline-flex items-center bg-violet-100 text-violet-700 px-4 py-2 rounded-full font-medium">
                                <i class="fa-regular fa-clock mr-2"></i>
                                Duración estimada: <span id="plan-duration"></span>
                            </div>

                        </section>

                        <!-- Temas recomendados -->

                        <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                            <div class="flex items-center gap-3 mb-3">

                                <i class="fa-solid fa-book-open text-2xl text-violet-600"></i>

                                <h2 class="text-xl font-semibold text-gray-800">
                                    Temas recomendados
                                </h2>

                            </div>

                            <p class="text-gray-500 mb-6">
                                Estos temas fueron seleccionados automáticamente a partir del análisis de tu actividad.
                            </p>

                            <div id="plan-topics" class="space-y-4"></div>

                        </section>

                        <!-- Recomendación IA -->

                        <section class="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-8">

                            <div class="flex items-center gap-3 mb-4">

                                <i class="fa-solid fa-brain text-2xl text-violet-600"></i>

                                <h2 class="text-xl font-semibold text-gray-800">
                                    Recomendación de Mentia IA
                                </h2>

                            </div>

                            <p class="text-gray-500 mb-5">
                                Esta recomendación fue generada automáticamente con base en el análisis de tu actividad.
                            </p>

                            <div class="bg-violet-50 rounded-2xl p-5">

                                <p id="plan-recommendation" class="text-gray-700 leading-7"></p>

                            </div>

                        </section>

                    </section>

                    <p id="plan-loading" class="text-center text-gray-500 mt-10">
                        Cargando plan de estudio...
                    </p>

                </main>

            </div>

        `;

    },

    async mounted() {

        sidebar.mounted();

        let idActividad = new URLSearchParams(window.location.search).get("id");

        // el selector de actividades queda siempre visible para poder cambiar de una a otra sin perderlo
        const analizadas = (await obtenerActividades()).filter((actividad) => actividad.estado === "completado");

        if (analizadas.length === 0) {
            document.getElementById("activity-picker-section").classList.add("hidden");
            document.getElementById("plan-loading").innerHTML =
                'Todavía no tienes actividades analizadas. <a href="#" id="ir-a-subir" class="text-violet-600 hover:underline">Sube una actividad</a>';
            document.getElementById("ir-a-subir").addEventListener("click", (event) => {
                event.preventDefault();
                navigate("/upload");
            });
            return;
        }

        // si no eligieron una actividad puntual (ej: desde el menu lateral), se muestra la mas reciente por defecto
        if (!idActividad) idActividad = String(analizadas[0].id_actividad);

        const selector = document.getElementById("activity-picker");
        selector.innerHTML = analizadas.map((actividad) => `
            <option value="${actividad.id_actividad}" ${String(actividad.id_actividad) === String(idActividad) ? "selected" : ""}>
                ${actividad.nombre_proyecto} (${new Date(actividad.fecha_subida).toLocaleDateString("es-ES")})
            </option>
        `).join("");
        selector.addEventListener("change", (event) => {
            navigate(`/study-plan?id=${event.target.value}`);
        });

        const datos = await obtenerActividad(idActividad);

        if (!datos.planEstudio) {
            document.getElementById("plan-loading").textContent = "Esta actividad todavía no tiene un plan de estudio.";
            return;
        }

        document.getElementById("plan-loading").classList.add("hidden");
        document.getElementById("study-plan-content").classList.remove("hidden");

        document.getElementById("plan-goal").textContent = datos.planEstudio.objetivo;
        document.getElementById("plan-duration").textContent = datos.planEstudio.duracion;
        document.getElementById("plan-recommendation").textContent = datos.planEstudio.recomendacion_general;

        document.getElementById("plan-topics").innerHTML = datos.temas.map((tema) => `
            <div class="flex items-center gap-4 bg-violet-50 rounded-xl px-5 py-4">
                <i class="fa-solid fa-check text-violet-600"></i>
                <span class="text-gray-700 font-medium">
                    ${tema.nombre}
                </span>
            </div>
        `).join("");

    }

};

export default studyPlan;

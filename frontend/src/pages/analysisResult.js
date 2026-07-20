import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";
import { obtenerActividad } from "../api.js";


function calificacionSegunPuntaje(puntaje) {
    if (puntaje >= 90) return "Excelente";
    if (puntaje >= 75) return "Bueno";
    if (puntaje >= 50) return "Regular";
    return "Necesita mejorar";
}


function textoAViñetas(texto) {
    return texto
        .split("\n")
        .filter((linea) => linea.trim() !== "")
        .map((linea) => `• ${linea}`)
        .join("<br>");
}

const analysisResult = {

    render() {

        return `

            <div class="min-h-screen bg-gray-100 lg:flex">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Resultado del análisis IA",
                        "Consulta el análisis generado automáticamente por Mentia."
                    )}

                    <section id="analysis-content" class="hidden">

                        <section class="bg-white rounded-2xl shadow-sm p-6 mt-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                            <div>

                                <span id="analysis-language" class="inline-block bg-violet-100 text-violet-700 text-sm font-medium px-4 py-1 rounded-full"></span>

                                <h2 id="analysis-title" class="text-2xl md:text-3xl font-bold text-gray-800 mt-4"></h2>

                                <p id="analysis-date" class="text-sm text-gray-400 mt-1"></p>

                            </div>

                            <div class="text-center">

                                <h2 id="analysis-score" class="text-5xl md:text-6xl font-bold text-[#6c4ef6]"></h2>

                                <p class="text-gray-500">
                                    /100
                                </p>

                            </div>

                        </section>

                        <!-- Archivo/imagen subida -->

                        <section id="analysis-image-section" class="bg-white rounded-2xl shadow-sm p-6 mt-6 hidden">

                            <h3 class="text-lg font-semibold text-gray-800 mb-4">
                                Archivo entregado
                            </h3>

                            <img id="analysis-image" class="max-w-full rounded-xl border border-gray-200" />

                        </section>

                        <!-- Calificación -->

                        <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                            <div class="flex justify-between items-center">

                                <h3 class="text-lg font-semibold text-gray-800">
                                    Calificación obtenida
                                </h3>

                                <span id="analysis-status" class="text-green-600 font-semibold"></span>

                            </div>

                            <div class="w-full h-3 bg-gray-200 rounded-full mt-5">

                                <div id="analysis-bar" class="h-3 bg-green-500 rounded-full"></div>

                            </div>

                        </section>

                        <!-- Resumen -->

                        <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                            <h3 class="text-lg font-semibold text-gray-800">
                                Resumen del análisis
                            </h3>

                            <p id="analysis-summary" class="text-gray-600 leading-7 mt-4 text-sm md:text-base"></p>

                        </section>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                        <!-- Fortalezas -->

                        <section class="bg-white rounded-2xl shadow-sm p-6">

                            <h3 class="text-lg font-semibold text-gray-800 mb-4">
                                Fortalezas
                            </h3>

                            <div id="analysis-strengths" class="text-gray-600 leading-8"></div>

                        </section>

                        <!-- Aspectos por mejorar -->

                        <section class="bg-white rounded-2xl shadow-sm p-6">

                            <h3 class="text-lg font-semibold text-gray-800 mb-4">
                                Aspectos por mejorar
                            </h3>

                            <div id="analysis-improvements" class="text-gray-600 leading-8"></div>

                        </section>

                    </div>

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-8">

                        <h3 class="text-lg font-semibold text-gray-800">
                            Recomendación de Mentia IA
                        </h3>

                        <p id="analysis-recommendation" class="text-gray-600 leading-7 mt-4"></p>

                        <button id="study-plan-button" class="mt-6 w-full sm:w-auto bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition">
                            Ver plan de estudio
                        </button>

                    </section>

                    </section>

                    <p id="analysis-loading" class="text-center text-gray-500 mt-10">
                        Cargando análisis...
                    </p>

                </main>

            </div>

        `;

    },

    async mounted() {

        sidebar.mounted();

        const idActividad = new URLSearchParams(window.location.search).get("id");

        document.getElementById("study-plan-button")?.addEventListener("click", function () {
            navigate(`/study-plan?id=${idActividad}`);
        });

        // si entraron aqui sin elegir una actividad, se manda a "mis actividades" para que elijan una
        if (!idActividad) {
            document.getElementById("analysis-loading").innerHTML =
                'Elige una actividad para ver su análisis. <a href="#" id="ir-a-actividades" class="text-violet-600 hover:underline">Ver mis actividades</a>';
            document.getElementById("ir-a-actividades").addEventListener("click", (event) => {
                event.preventDefault();
                navigate("/activities");
            });
            return;
        }

        const datos = await obtenerActividad(idActividad);

        if (!datos.analisis) {
            document.getElementById("analysis-loading").textContent = "Esta actividad todavía no tiene un análisis.";
            return;
        }

        document.getElementById("analysis-loading").classList.add("hidden");
        document.getElementById("analysis-content").classList.remove("hidden");

        document.getElementById("analysis-language").textContent = datos.actividad.lenguaje;
        document.getElementById("analysis-title").textContent = datos.actividad.nombre_proyecto;
        document.getElementById("analysis-date").textContent =
            "Entregado el " + new Date(datos.actividad.fecha_subida).toLocaleDateString("es-ES");

        document.getElementById("analysis-score").textContent = datos.analisis.puntaje;
        document.getElementById("analysis-status").textContent = calificacionSegunPuntaje(datos.analisis.puntaje);
        document.getElementById("analysis-bar").style.width = `${datos.analisis.puntaje}%`;

        document.getElementById("analysis-summary").textContent = datos.analisis.resumen;
        document.getElementById("analysis-strengths").innerHTML = textoAViñetas(datos.analisis.fortalezas || "");
        document.getElementById("analysis-improvements").innerHTML = textoAViñetas(datos.analisis.aspectos_mejorar || "");
        document.getElementById("analysis-recommendation").textContent = datos.analisis.recomendacion;

        
        if (datos.archivoUrl && /\.(png|jpe?g|gif|webp)$/i.test(datos.archivoUrl)) {
            document.getElementById("analysis-image-section").classList.remove("hidden");
            document.getElementById("analysis-image").src = datos.archivoUrl;
        }

    }

};

export default analysisResult;

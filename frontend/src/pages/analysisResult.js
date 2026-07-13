import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";

const analysisResult = {

    render() {

        const analysis = {

            subject: "Literatura",

            title: "Análisis de poema modernista",

            course: "Literatura Hispanoamericana",

            deliveryDate: "20 de junio de 2025",

            score: 95,

            status: "Excelente",

            summary: "El análisis demuestra una excelente comprensión del texto.",

            strengths: `
                • Identificación correcta de figuras literarias.<br>
                • Excelente comprensión del tema.<br>
                • Buena argumentación.<br>
                • Vocabulario apropiado.<br>
                • Redacción clara.
            `,

            improvements: `
                • Profundizar el análisis métrico.<br>
                • Relacionar el poema con otros autores.<br>
                • Agregar más ejemplos.
            `,

            recommendation: "Te recomendamos reforzar el estudio de la métrica y la comparación entre movimientos literarios."

        };

        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Resultado del análisis IA",
                        "Consulta el análisis generado automáticamente por Mentia."
                    )}

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                        <div>

                            <span class="inline-block bg-violet-100 text-violet-700 text-sm font-medium px-4 py-1 rounded-full">
                                ${analysis.subject}
                            </span>

                            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
                                ${analysis.title}
                            </h2>

                            <p class="text-gray-500 mt-2">
                                ${analysis.course}
                            </p>

                            <p class="text-sm text-gray-400 mt-1">
                                Entregado el ${analysis.deliveryDate}
                            </p>

                        </div>

                        <div class="text-center">

                            <h2 class="text-5xl md:text-6xl font-bold text-[#6c4ef6]">
                                ${analysis.score}
                            </h2>

                            <p class="text-gray-500">
                                /100
                            </p>

                        </div>

                    </section>

                    <!-- Calificación -->

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                        <div class="flex justify-between items-center">

                            <h3 class="text-lg font-semibold text-gray-800">
                                Calificación obtenida
                            </h3>

                            <span class="text-green-600 font-semibold">
                                ${analysis.status}
                            </span>

                        </div>

                        <div class="w-full h-3 bg-gray-200 rounded-full mt-5">

                            <div class="h-3 bg-green-500 rounded-full"
                                style="width:${analysis.score}%;">
                            </div>

                        </div>

                    </section>

                    <!-- Resumen -->

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                        <h3 class="text-lg font-semibold text-gray-800">
                            Resumen del análisis
                        </h3>

                        <p class="text-gray-600 leading-7 mt-4 text-sm md:text-base">
                            ${analysis.summary}
                        </p>

                    </section>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

                    <!-- Fortalezas -->

                    <section class="bg-white rounded-2xl shadow-sm p-6">

                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            Fortalezas
                        </h3>

                        <div class="text-gray-600 leading-8">
                            ${analysis.strengths}
                        </div>

                    </section>

                    <!-- Aspectos por mejorar -->

                    <section class="bg-white rounded-2xl shadow-sm p-6">

                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            Aspectos por mejorar
                        </h3>

                        <div class="text-gray-600 leading-8">
                            ${analysis.improvements}
                        </div>

                    </section>

                </div>

                <section class="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-8">

                    <h3 class="text-lg font-semibold text-gray-800">
                        Recomendación de Mentia IA
                    </h3>

                    <p class="text-gray-600 leading-7 mt-4">
                        ${analysis.recommendation}
                    </p>
 
                    <button id="study-plan-button" class="mt-6 w-full sm:w-auto bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition">
                        Ver plan de estudio
                    </button>

                </section>

                </main>

            </div>

        `;

    },

    mounted() {

        sidebar.mounted();

        document.getElementById("study-plan-button") ?.addEventListener("click", function () {
            navigate("/study-plan");
        });

    }

};

export default analysisResult;
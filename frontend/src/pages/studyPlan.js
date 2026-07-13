import sidebar from "../components/sidebar.js";
import header from "../components/header.js";

const studyPlan = {

    render() {

        const studyPlan = {

            objective: {

                goal: "Mejorar el uso de estructuras condicionales y funciones para desarrollar soluciones más organizadas y eficientes.",

                duration: "2 semanas"

            },

            topics: [

                "Condicionales",

                "Funciones",

                "Manejo de errores"

            ],

            recommendation: {

                description: "Se detectó un buen dominio de la lógica básica, pero aún es recomendable reforzar el uso de funciones y el manejo de errores para desarrollar soluciones más robustas."

            }

        };

        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Plan de estudio",
                        "Generado a partir del análisis más reciente de tu actividad."
                    )}

                    <!-- Objetivo -->

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-8">

                        <div class="flex items-center gap-3 mb-4">

                            <i class="fa-solid fa-bullseye text-2xl text-violet-600"></i>

                            <h2 class="text-xl font-semibold text-gray-800">
                                Objetivo del plan
                            </h2>

                        </div>

                        <p class="text-gray-600 leading-7">
                            ${studyPlan.objective.goal}
                        </p>

                        <div class="mt-6 inline-flex items-center bg-violet-100 text-violet-700 px-4 py-2 rounded-full font-medium">
                            <i class="fa-regular fa-clock mr-2"></i>
                            Duración estimada: ${studyPlan.objective.duration}
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

                        <div class="space-y-4">

                            ${studyPlan.topics.map(topic => ` <div class="flex items-center gap-4 bg-violet-50 rounded-xl px-5 py-4">
                                    <i class="fa-solid fa-check text-violet-600"></i>
                                    <span class="text-gray-700 font-medium">
                                        ${topic}
                                    </span>
                                </div>`).join("")}
                        </div>

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

                            <p class="text-gray-700 leading-7">
                                ${studyPlan.recommendation.description}
                            </p>

                        </div>

                    </section>

                </main>

            </div>

        `;

    },

    mounted() {

        sidebar.mounted();

    }

};

export default studyPlan;
import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";

const dashboard = {

    render() {

        const dashboard = {

            summary: {

                uploadedActivities: 5,

                analyzedActivities: 4,

                studyPlanStatus: "Activo"

            },

            lastActivity: {

                title: "Análisis de poema modernista",

                subject: "Literatura Hispanoamericana",

                deliveryDate: "20 de junio de 2025"

            },

            studyPlan: {

                message: "Actualmente tienes un plan de estudio activo generado por Mentia IA."

            }

        };

        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8">

                    ${header.render(
                        "Bienvenido a Mentia",
                        "Aquí encontrarás el resumen de tu aprendizaje."
                    )}

                    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                        <div class="bg-white rounded-2xl shadow-sm p-6">

                            <p class="text-gray-500">
                                Actividades subidas
                            </p>

                            <h2 class="text-4xl font-bold mt-3">
                                ${dashboard.summary.uploadedActivities}
                            </h2>

                        </div>

                        <div class="bg-white rounded-2xl shadow-sm p-6">

                            <p class="text-gray-500">
                                Actividades analizadas
                            </p>

                            <h2 class="text-4xl font-bold mt-3">
                                ${dashboard.summary.analyzedActivities}
                            </h2>

                        </div>

                        <div class="bg-white rounded-2xl shadow-sm p-6">

                            <p class="text-gray-500">
                                Plan de estudio
                            </p>

                            <h2 class="text-2xl font-bold text-green-600 mt-3">
                                ${dashboard.summary.studyPlanStatus}
                            </h2>

                        </div>

                    </section>

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-8">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Última actividad
                        </h2>

                        <div class="mt-5">

                            <p class="font-semibold text-gray-700">
                                ${dashboard.lastActivity.title}
                            </p>

                            <p class="text-gray-500 mt-2">
                                ${dashboard.lastActivity.subject}
                            </p>

                            <p class="text-sm text-gray-400 mt-2">
                                Enviado el ${dashboard.lastActivity.deliveryDate}
                            </p>

                            <button id="view-analysis-button" class="mt-6 bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl">
                                Ver análisis
                            </button>

                        </div>

                    </section>

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Estado del plan de estudio
                        </h2>

                        <p class="text-gray-500 mt-4">
                            ${dashboard.studyPlan.message}
                        </p>

                        <button id="study-plan-button" class="mt-6 bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl">
                            Ver plan de estudio
                        </button>

                    </section>

                    <section class="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-8">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Acciones rápidas
                        </h2>

                        <div class="flex flex-wrap gap-4 mt-6">

                            <button id="upload-button" class="bg-[#6c4ef6] text-white px-6 py-3 rounded-xl hover:bg-violet-700">
                                Subir actividad
                            </button>

                            <button id="activities-button"  class="border border-[#6c4ef6] text-[#6c4ef6] px-6 py-3 rounded-xl hover:bg-violet-50">
                                Mis actividades
                            </button>

                        </div>

                    </section>

                </main>

            </div>

        `;

    },

    mounted() {

        sidebar.mounted();

        document.getElementById("view-analysis-button")?.addEventListener("click", 
            function () { navigate("/analysis");
        });

        document.getElementById("study-plan-button")?.addEventListener("click", 
            function () { navigate("/study-plan");
        });

        document.getElementById("upload-button")?.addEventListener("click", 
            function () { navigate("/upload");
        });

        document.getElementById("activities-button")?.addEventListener("click", 
            function () { navigate("/activities");
        });

    }

};

export default dashboard;
import sidebar from "../components/sidebar.js";
import header from "../components/header.js";


const activities = {

    render() {

        const activities = {

            title: "Historial de entregas",

            description: "Consulta las actividades que has enviado y el estado de análisis generado por Mentia IA.",

            submissions: [

                {

                    title: "Algoritmos de Ordenamiento",

                    language: "Python",

                    deliveryDate: "20 de junio de 2025",

                    score: 92,

                    status: "Analizado",

                    description: "Implementación de algoritmos para organizar datos de manera eficiente."

                },

                {

                    title: "API RESTful Express",

                    language: "JS",

                    deliveryDate: "18 de junio de 2025",

                    score: null,

                    status: "En análisis",

                    description: "Creación de una API utilizando rutas, métodos HTTP y manejo de solicitudes."

                },

                {

                    title: "Estructuras de Datos",

                    language: "C++",

                    deliveryDate: "10 de junio de 2025",

                    score: 75,

                    status: "Analizado",

                    description: "Ejercicio enfocado en el uso y comprensión de estructuras fundamentales."

                }

            ]

        };


        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Mis actividades",
                        activities.description
                    )}

                    <section class="mt-8">

                        <h2 class="text-3xl font-bold text-gray-800">
                            ${activities.title}
                        </h2>

                        <p class="text-gray-500 mt-2">
                            Revisa tus entregas anteriores y el estado de evaluación de cada actividad.
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

                            ${activities.submissions.map(activity => `

                                <article class="bg-white rounded-2xl shadow-sm p-6">

                                    <div class="flex justify-between items-start gap-4">

                                        <div>

                                            <h3 class="text-xl font-semibold text-gray-800">
                                                ${activity.title}
                                            </h3>

                                            <span class="inline-block mt-3 bg-violet-100 text-violet-700 px-4 py-1 rounded-full text-sm font-medium">
                                                ${activity.language}
                                            </span>

                                        </div>

                                    </div>

                                    <p class="text-sm text-gray-400 mt-5">
                                        Entregado el ${activity.deliveryDate}
                                    </p>

                                    <p class="text-gray-500 text-sm leading-6 mt-4">
                                        ${activity.description}
                                    </p>

                                    <div class="flex items-center justify-between mt-8">

                                        ${activity.score ? `

                                            <div class="flex items-center gap-4">

                                                <div class="relative w-16 h-16 flex items-center justify-center">

                                                    <svg class="w-16 h-16 transform -rotate-90">

                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="26"
                                                            stroke="#e5e7eb"
                                                            stroke-width="6"
                                                            fill="transparent"
                                                        />

                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="26"
                                                            stroke="#6c4ef6"
                                                            stroke-width="6"
                                                            fill="transparent"
                                                            stroke-dasharray="163"
                                                            stroke-dashoffset="${163 - (163 * activity.score) / 100}"
                                                        />

                                                    </svg>

                                                    <span class="absolute text-sm font-bold text-gray-800">
                                                        ${activity.score}
                                                    </span>

                                                </div>

                                                <span class="text-green-600 font-semibold">
                                                    ${activity.status}
                                                </span>

                                            </div> `

                                            :

                                            `
                                            <div class="flex items-center gap-3">

                                                <i class="fa-solid fa-hourglass-half text-yellow-500 text-xl"></i>
                                                <span class="text-yellow-600 font-semibold">
                                                    ${activity.status}
                                                </span>

                                            </div>
                                            `
                                        }

                                    </div>

                                </article>

                            `).join("")}

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


export default activities;
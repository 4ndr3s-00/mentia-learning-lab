import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { obtenerDiagnostico, guardarDiagnostico } from "../api.js";

// preguntas del test: cada opcion apunta al tipo de aprendizaje que representa
const PREGUNTAS = [
    {
        texto: "Cuando aprendes algo nuevo, prefieres:",
        opciones: [
            { texto: "Ver diagramas, imágenes o videos", tipo: "visual" },
            { texto: "Escuchar una explicación", tipo: "auditivo" },
            { texto: "Practicarlo tú mismo desde el inicio", tipo: "kinestesico" },
        ],
    },
    {
        texto: "Para recordar algo importante, tú:",
        opciones: [
            { texto: "Visualizas la información escrita", tipo: "visual" },
            { texto: "La repites en voz alta varias veces", tipo: "auditivo" },
            { texto: "La asocias con una acción o movimiento", tipo: "kinestesico" },
        ],
    },
    {
        texto: "Prefieres estudiar:",
        opciones: [
            { texto: "Con mapas mentales, colores o esquemas", tipo: "visual" },
            { texto: "Escuchando podcasts, audios o música", tipo: "auditivo" },
            { texto: "Caminando, moviéndote o haciendo ejercicios prácticos", tipo: "kinestesico" },
        ],
    },
    {
        texto: "Cuando armas algo nuevo (un mueble, una receta), tú:",
        opciones: [
            { texto: "Miras las imágenes de las instrucciones", tipo: "visual" },
            { texto: "Pides que te expliquen paso a paso", tipo: "auditivo" },
            { texto: "Empiezas a intentarlo sin leer mucho", tipo: "kinestesico" },
        ],
    },
    {
        texto: "En clase, prefieres que el profesor:",
        opciones: [
            { texto: "Use diapositivas, pizarra o gráficos", tipo: "visual" },
            { texto: "Explique hablando con detalle", tipo: "auditivo" },
            { texto: "Proponga actividades prácticas", tipo: "kinestesico" },
        ],
    },
    {
        texto: "Te resulta más fácil recordar:",
        opciones: [
            { texto: "Caras y lugares que viste", tipo: "visual" },
            { texto: "Nombres y cosas que escuchaste", tipo: "auditivo" },
            { texto: "Cosas que hiciste tú mismo", tipo: "kinestesico" },
        ],
    },
];


const PERFIL_PARA_BD = { visual: "Visual", auditivo: "Auditivo", kinestesico: "Kinestesico" };

const NOMBRE_PERFIL = { Visual: "Visual", Auditivo: "Auditivo", Kinestesico: "Kinestésico", Mixto: "Mixto (un poco de cada uno)" };

const diagnostic = {

    render() {

        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">

                    ${header.render(
                        "Test diagnóstico",
                        "Descubre tu estilo de aprendizaje: visual, auditivo o kinestésico."
                    )}

                    <p id="diagnostic-loading" class="text-center text-gray-500 mt-10">
                        Cargando...
                    </p>

                    <!-- Resultado (si ya hizo el test) -->

                    <section id="diagnostic-result" class="bg-white rounded-2xl shadow-sm p-6 mt-8 hidden">

                        <h2 class="text-xl font-semibold text-gray-800">
                            Tu estilo de aprendizaje es:
                            <span id="result-perfil" class="text-violet-600"></span>
                        </h2>

                        <div class="grid grid-cols-3 gap-4 mt-6 text-center">

                            <div class="bg-violet-50 rounded-xl p-4">
                                <p class="text-gray-500 text-sm">Visual</p>
                                <p id="result-visual" class="text-2xl font-bold text-gray-800"></p>
                            </div>

                            <div class="bg-violet-50 rounded-xl p-4">
                                <p class="text-gray-500 text-sm">Auditivo</p>
                                <p id="result-auditivo" class="text-2xl font-bold text-gray-800"></p>
                            </div>

                            <div class="bg-violet-50 rounded-xl p-4">
                                <p class="text-gray-500 text-sm">Kinestésico</p>
                                <p id="result-kinestesico" class="text-2xl font-bold text-gray-800"></p>
                            </div>

                        </div>

                        <button id="repetir-button" class="mt-6 bg-[#6c4ef6] hover:bg-violet-700 text-white px-6 py-3 rounded-xl">
                            Repetir el test
                        </button>

                    </section>

                    <!-- Formulario del test -->

                    <form id="diagnostic-form" class="hidden space-y-6 mt-8">

                        ${PREGUNTAS.map((pregunta, indice) => `

                            <section class="bg-white rounded-2xl shadow-sm p-6">

                                <h3 class="font-semibold text-gray-800 mb-4">
                                    ${indice + 1}. ${pregunta.texto}
                                </h3>

                                <div class="space-y-3">

                                    ${pregunta.opciones.map((opcion, i) => `
                                        <label class="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-violet-50">
                                            <input type="radio" name="pregunta-${indice}" value="${opcion.tipo}" ${i === 0 ? "required" : ""}>
                                            <span class="text-gray-700">${opcion.texto}</span>
                                        </label>
                                    `).join("")}

                                </div>

                            </section>

                        `).join("")}

                        <button type="submit" class="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold text-lg">
                            Ver mi resultado
                        </button>

                    </form>

                </main>

            </div>

        `;

    },

    async mounted() {

        sidebar.mounted();

        const cargando = document.getElementById("diagnostic-loading");
        const resultado = document.getElementById("diagnostic-result");
        const formulario = document.getElementById("diagnostic-form");

        // muestra el resultado guardado en pantalla
        function mostrarResultado(datos) {
            document.getElementById("result-perfil").textContent = NOMBRE_PERFIL[datos.perfil_aprendizaje] || datos.perfil_aprendizaje;
            document.getElementById("result-visual").textContent = `${datos.puntaje_visual}%`;
            document.getElementById("result-auditivo").textContent = `${datos.puntaje_auditivo}%`;
            document.getElementById("result-kinestesico").textContent = `${datos.puntaje_kinestesico}%`;
            resultado.classList.remove("hidden");
            formulario.classList.add("hidden");
        }

        // revisa si el usuario ya hizo el test antes
        const datosPrevios = await obtenerDiagnostico();
        cargando.classList.add("hidden");

        if (datosPrevios && datosPrevios.perfil_aprendizaje) {
            mostrarResultado(datosPrevios);
        } else {
            formulario.classList.remove("hidden");
        }

        document.getElementById("repetir-button")?.addEventListener("click", () => {
            resultado.classList.add("hidden");
            formulario.classList.remove("hidden");
        });

        formulario.addEventListener("submit", async (event) => {
            event.preventDefault();

            // cuenta cuantas veces se eligio cada tipo de respuesta
            const conteo = { visual: 0, auditivo: 0, kinestesico: 0 };
            PREGUNTAS.forEach((_, indice) => {
                const elegida = formulario.querySelector(`input[name="pregunta-${indice}"]:checked`);
                if (elegida) conteo[elegida.value]++;
            });

            // convierte el conteo en un porcentaje (de 0 a 100) por cada tipo
            const totalPreguntas = PREGUNTAS.length;
            const puntajeVisual = Math.round((conteo.visual / totalPreguntas) * 100);
            const puntajeAuditivo = Math.round((conteo.auditivo / totalPreguntas) * 100);
            const puntajeKinestesico = Math.round((conteo.kinestesico / totalPreguntas) * 100);

            // el perfil final es el tipo con el puntaje mas alto (si hay empate entre varios, es "Mixto")
            const puntajes = { visual: puntajeVisual, auditivo: puntajeAuditivo, kinestesico: puntajeKinestesico };
            const maximo = Math.max(puntajeVisual, puntajeAuditivo, puntajeKinestesico);
            const ganadores = Object.keys(puntajes).filter((tipo) => puntajes[tipo] === maximo);
            const perfil = ganadores.length > 1 ? "Mixto" : PERFIL_PARA_BD[ganadores[0]];

            try {
                const datosGuardados = await guardarDiagnostico({
                    puntaje_visual: puntajeVisual,
                    puntaje_auditivo: puntajeAuditivo,
                    puntaje_kinestesico: puntajeKinestesico,
                    perfil_aprendizaje: perfil,
                });
                mostrarResultado(datosGuardados);
            } catch (error) {
                alert(error.message);
            }
        });

    }

};

export default diagnostic;

import sidebar from "../components/sidebar.js";
import header from "../components/header.js";
import { navigate } from "../router.js";

const upload = {
    render() {

        const workspace = {

            title: "Workspace de Código",

            description: "Sube tu archivo o escribe tu código directamente para iniciar el análisis interactivo.",

            exampleCode: `
    def analizar_condiciones(edad, tiene_permiso):

        """
        Función para evaluar si un estudiante puede acceder
        al material avanzado.
        """

        if edad >= 18 or tiene_permiso:
            return "Acceso concedido"

        elif edad < 18 and not tiene_permiso:
            return "Acceso denegado"

        else:
            return "Estado no determinado"
            `,

            languages: [
                "Python",
                "JavaScript",
                "Java",
                "HTML",
                "CSS"
            ]

        };


        return `

            <div class="flex min-h-screen bg-gray-100">

                ${sidebar.render()}

                <main class="flex-1 p-8 overflow-y-auto">


                    ${header.render(
                        workspace.title,
                        workspace.description
                    )}


                    <section class="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">

                        <!-- Editor -->

                        <div class="xl:col-span-2">

                            <section class="bg-white rounded-2xl shadow-sm overflow-hidden">

                                <!-- Encabezado editor -->

                                <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">

                                    <div class="flex items-center gap-3">

                                        <i class="fa-solid fa-code text-[#6c4ef6] text-xl"></i>

                                        <h2 class="text-xl font-semibold text-gray-800">
                                            Área de Código
                                        </h2>

                                    </div>


                                    <div class="flex items-center gap-4">

                                        <button id="copy-button" class="text-gray-500 hover:text-[#6c4ef6] transition">
                                            <i class="fa-regular fa-copy text-lg"></i>
                                        </button>

                                        <button id="fullscreen-button" class="text-gray-500 hover:text-[#6c4ef6] transition">
                                            <i class="fa-solid fa-expand text-lg"></i>
                                        </button>

                                    </div>


                                </div>

                                <!-- Código -->

                                <textarea id="code-editor" spellcheck="false" class="w-full h-[620px] resize-none outline-none p-6 bg-gray-50 font-mono text-[15px] leading-7">
                                    ${workspace.exampleCode}
                                </textarea>

                            </section>

                        </div>

                        <!-- Panel configuración -->

                        <section class="bg-white rounded-3xl shadow-sm p-6 h-fit">

                            <!-- Nombre proyecto -->

                            <div class="mb-6">

                                <label class="block text-sm font-semibold text-gray-500 uppercase mb-2">
                                    Nombre del proyecto
                                </label>
                                <input id="project-name" type="text" placeholder="Ej: Taller de Condicionales" class="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" >
                            </div>

                            <!-- Lenguaje -->

                            <div class="mb-6">

                                <label class="block text-sm font-semibold text-gray-500 uppercase mb-2">
                                    Lenguaje de programación
                                </label>

                                <select id="language" class="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" >

                                    ${workspace.languages.map(language => `
                                        <option>
                                            ${language}
                                        </option>

                                    `).join("")}
                                </select>

                            </div>

                            <!-- Archivo -->

                            <div class="mb-8">


                                <label class="block text-sm font-semibold text-gray-500 uppercase mb-2">
                                    Archivo fuente
                                </label>

                                <div id="drop-area" class="relative border-2 border-dashed border-violet-200 rounded-2xl bg-violet-50 p-10 text-center transition" >

                                    <i class="fa-solid fa-cloud-arrow-up text-5xl text-violet-600 mb-5"></i>

                                    <h3 class="font-semibold text-lg">
                                        Arrastra tu archivo aquí
                                    </h3>

                                    <p class="text-gray-500 mt-2">
                                        o selecciónalo desde tu computador
                                    </p>

                                    <input id="file-input" type="file" class="absolute inset-0 opacity-0 cursor-pointer">

                                </div>

                            </div>

                            <!-- Botón análisis -->

                            <button id="analyze-button" class="w-full bg-violet-600 hover:bg-violet-700 transition text-white py-4 rounded-2xl font-semibold text-lg" >

                                <i class="fa-solid fa-brain mr-2"></i>

                                Iniciar análisis con IA

                            </button>

                        </section>

                    </section>

                </main>

            </div>

        `;

    },


    mounted() {

        sidebar.mounted();

       

        const textarea = document.getElementById("code-editor");

        const copyButton = document.getElementById("copy-button");

        const fullscreenButton = document.getElementById("fullscreen-button");

        const fileInput = document.getElementById("file-input");

        const dropArea = document.getElementById("drop-area");

        const analyzeButton = document.getElementById("analyze-button");

        const projectName = document.getElementById("project-name");

        const language = document.getElementById("language");

        copyButton?.addEventListener("click", async () => { await navigator.clipboard.writeText(textarea.value);

            copyButton.innerHTML =
                '<i class="fa-solid fa-check"></i>';

            setTimeout(() => { copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
            },1500);
        });
        
        fullscreenButton?.addEventListener("click", () => {

            const editor = document.getElementById("editor");

            if(!document.fullscreenElement){
                editor.requestFullscreen();
            }else{
                document.exitFullscreen();
            }
        });

        fileInput?.addEventListener("change", () => {

            if(fileInput.files.length > 0){
                const archivo = fileInput.files[0];
                dropArea.querySelector("h3").textContent = archivo.name;

                dropArea.querySelector("p").textContent = "Archivo listo para analizar";
            }
        });

        dropArea?.addEventListener("dragover", (event) => { event.preventDefault();

            dropArea.classList.remove("border-violet-200");
            dropArea.classList.add("border-violet-600");

        });

        dropArea?.addEventListener("dragleave", () => {

            dropArea.classList.remove("border-violet-600");
            dropArea.classList.add("border-violet-200");

        });

        dropArea?.addEventListener("drop", (event) => {

            event.preventDefault();

            dropArea.classList.remove("border-violet-600");
            dropArea.classList.add("border-violet-200");

            if(event.dataTransfer.files.length > 0){

                fileInput.files = event.dataTransfer.files;

                const archivo = event.dataTransfer.files[0];

                dropArea.querySelector("h3").textContent = archivo.name;

                dropArea.querySelector("p").textContent = "Archivo listo para analizar";

            }

        });

        analyzeButton?.addEventListener("click", () => {

            const codigo = textarea.value.trim();
            const archivo = fileInput.files.length;

            if (codigo === "" && archivo === 0) {
                alert("Debes escribir un código o subir un archivo.");
                return;
            }

            navigate("/analysis");
        });

    }

};

export default upload;
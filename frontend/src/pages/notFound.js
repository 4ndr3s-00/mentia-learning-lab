import { navigate } from "../router.js";

const notFound = {

    render() {

        return `

        <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">

            <h1 class="text-8xl font-bold text-violet-600">
                404
            </h1>

            <h2 class="text-3xl font-semibold text-gray-800 mt-4">
                Página no encontrada
            </h2>

            <p class="text-gray-500 mt-3 text-center max-w-md">
                La página que intentas visitar no existe o fue movida.
            </p>

            <button id="back-home" class="mt-8 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl">
                Volver al Dashboard
            </button>

        </div>

        `;

    },

    mounted() {

        document.getElementById("back-home")
            .addEventListener("click", () => navigate("/dashboard"));

    }

};

export default notFound;
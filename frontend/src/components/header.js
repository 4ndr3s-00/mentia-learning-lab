const header = {

    render(title, description) {

        return `

            <header class="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm mb-6">

                <!-- Información de la página -->

                <div>

                    <h1 class="text-3xl font-bold text-gray-800">

                        ${title}

                    </h1>

                    <p class="text-gray-500 mt-1">

                        ${description}

                    </p>

                </div>

                <!-- Acciones del usuario -->

                <div class="flex items-center gap-5">

                    <button
                        class="text-gray-500 hover:text-violet-600 transition">

                        <i class="fa-regular fa-bell text-xl"></i>

                    </button>

                    <div
                        class="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center">

                        <i class="fa-solid fa-user text-violet-600"></i>

                    </div>

                </div>

            </header>

        `;

    },

    mounted() {

        // Aquí irán los eventos del header.

    }

};

export default header;
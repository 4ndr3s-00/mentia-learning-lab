import { navigate } from "../router.js";

const login = {

    render() {

        return `

            <div class="min-h-screen flex flex-col lg:flex-row bg-[#fafafa] font-[Poppins]">

                <!-- IZQUIERDA -->

                <section class="w-full lg:w-1/2 bg-[#f2efff] px-10 py-12 lg:px-16 lg:py-14 flex flex-col justify-between">

                    <!-- Logo -->

                    <div class="flex items-center gap-3">

                        <img src="/img/logo-mentia.png" alt="Mentia" class="w-12 h-12 object-contain">

                        <img src="/img/mentia.png" width="150">

                    </div>

                    <!-- Texto principal -->

                    <div class="mt-10">

                        <h1 class="text-4xl lg:text-5xl font-bold leading-tight text-[#1f2456]">
                            Aprende. Mejora.
                            <br>
                            Alcanza tu potencial.
                        </h1>

                        <p class="mt-6 text-gray-500 leading-8 max-w-xl">
                            Sube tus actividades, recibe análisis con IA y
                            obtén un plan de estudio personalizado para lograr
                            tus metas académicas.
                        </p>

                    </div>

                    <!-- Hero -->

                    <div class="relative h-[540px] mt-10">

                        <img src="/img/cuadro3-login.png"
                            class="absolute left-0 top-20 w-56">

                        <img src="/img/estudiante-login.png"
                            class="absolute left-1/2 -translate-x-1/2 bottom-4 w-[950px]">

                        <img src="/img/cuadro2-login.png"
                            class="absolute right-0 top-2 w-56">

                        <img src="/img/cuadro1-login.png"
                            class="absolute right-6 bottom-4 w-56">

                    </div>

                    <!-- Características -->

                    <div class="bg-white rounded-2xl p-6 mt-8 flex flex-col lg:flex-row gap-6">

                        <!-- Feature 1 -->

                        <div class="flex gap-4 flex-1">

                            <div class="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                <i class="fa-solid fa-upload"></i>
                            </div>

                            <div>

                                <h4 class="font-semibold text-gray-800">
                                    Sube tus actividades
                                </h4>

                                <p class="text-sm text-gray-500">
                                    Tareas, talleres o exámenes.
                                </p>

                            </div>

                        </div>

                        <!-- Feature 2 -->

                        <div class="flex gap-4 flex-1">

                            <div class="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                <i class="fa-solid fa-brain"></i>
                            </div>

                            <div>

                                <h4 class="font-semibold text-gray-800">
                                    Análisis con IA
                                </h4>

                                <p class="text-sm text-gray-500">
                                    Detectamos fortalezas y dificultades.
                                </p>

                            </div>

                        </div>

                        <!-- Feature 3 -->

                        <div class="flex gap-4 flex-1">

                            <div class="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                <i class="fa-solid fa-bullseye"></i>
                            </div>

                            <div>

                                <h4 class="font-semibold text-gray-800">
                                    Plan personalizado
                                </h4>

                                <p class="text-sm text-gray-500">
                                    Recibe un plan hecho para ti.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                <!-- DERECHA -->

                <section class="w-full lg:w-1/2 flex justify-center items-center p-12">

                    <div class="w-full max-w-xl flex flex-col">

                        <div class="bg-white rounded-3xl shadow-lg p-10 lg:p-14">

                            <h1 class="text-4xl lg:text-5xl font-bold text-center text-[#191d4e]">
                                Iniciar sesión
                            </h1>

                            <p class="text-center text-gray-500 mt-3 mb-10">

                                Bienvenido(a) de nuevo a
                                <span class="font-semibold text-violet-600">
                                    Mentia
                                </span>

                            </p>

                            <form id="login-form">

                                <!-- Correo -->

                                <label for="email" class="block mb-2 text-sm font-medium">
                                    Correo electrónico
                                </label>

                                <div class="flex items-center border border-gray-300 rounded-xl px-4 py-4 mb-6">

                                    <i class="fa-regular fa-envelope text-gray-400"></i>

                                    <input id="email" type="email" placeholder="coder@correo.com" class="flex-1 outline-none px-4">

                                </div>

                                <!-- Contraseña -->

                                <label for="password" class="block mb-2 text-sm font-medium"> Contraseña </label>

                                <div class="flex items-center border border-gray-300 rounded-xl px-4 py-4">

                                    <i class="fa-solid fa-lock text-gray-400"></i>

                                    <input id="password" type="password" placeholder="••••••••" class="flex-1 outline-none px-4">

                                    <button type="button" id="toggle-password" class="text-gray-400 hover:text-violet-600">
                                        <i class="fa-regular fa-eye"></i>
                                    </button>

                                </div>

                                <a href="#" class="block text-right text-sm text-violet-600 mt-4 mb-8">
                                    ¿Olvidaste tu contraseña?
                                </a>

                                <button id="login-button" class="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl text-lg font-medium transition">
                                    Iniciar sesión
                                </button>

                            </form>

                        </div>

                        <footer class="w-full mt-8 flex flex-col lg:flex-row justify-between items-center text-gray-500 text-sm gap-4">

                            <p>
                                © 2024 Mentia. Todos los derechos reservados.
                            </p>

                            <div class="flex gap-6">

                                <a href="#" class="text-violet-600 hover:underline">
                                    Términos de uso
                                </a>

                                <a href="#" class="text-violet-600 hover:underline">
                                    Privacidad
                                </a>

                            </div>

                        </footer>

                    </div>

                </section>

            </div>

        `;

    },

    mounted() {

        const loginButton = document.getElementById("login-button");

        loginButton.addEventListener("click", (event) => {
            event.preventDefault();
            navigate("/dashboard");
        });

        // ocultar la contraseña
        const togglePassword = document.getElementById("toggle-password");
        const passwordInput = document.getElementById("password");

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
            }else {
                passwordInput.type = "password";
            }
        });

    }

};

export default login;
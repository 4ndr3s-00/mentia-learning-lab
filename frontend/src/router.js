import analysisResult from "./pages/analysisResult.js";
import login from "./pages/login.js";
import dashboard from "./pages/dashboard.js";
import upload from "./pages/uploadActivity.js";
import studyPlan from "./pages/studyPlan.js";
import activities from "./pages/activities.js";
import profile from "./pages/profile.js";
import diagnostic from "./pages/diagnostic.js";
import notFound from "./pages/notFound.js";
import { obtenerToken } from "./api.js";


const routes = {

    "/": login,

    "/analysis": analysisResult,

    "/dashboard": dashboard,

    "/upload": upload,

    "/study-plan": studyPlan,

    "/activities": activities,

    "/profile": profile,

    "/diagnostic": diagnostic

};

const pageTitles = {

    "/": "Mentia | Login",

    "/dashboard": "Mentia | Dashboard",

    "/upload": "Mentia | Subir actividad",

    "/analysis": "Mentia | Resultado del análisis IA",

    "/study-plan": "Mentia | Plan de estudio",

    "/activities": "Mentia | Mis actividades",

    "/profile": "Mentia | Editar perfil",

    "/diagnostic": "Mentia | Test diagnóstico",

};


export function router() {

    let currentPath = window.location.pathname;

    const haySesion = Boolean(obtenerToken());

    // si no ha iniciado sesion y quiere ver una pagina protegida, lo mandamos al login
    if (!haySesion && currentPath !== "/") {
        history.replaceState(null, null, "/");
        currentPath = "/";
    }

    // si ya inicio sesion y esta en el login, lo mandamos directo al dashboard
    if (haySesion && currentPath === "/") {
        history.replaceState(null, null, "/dashboard");
        currentPath = "/dashboard";
    }

    const pageToShow = routes[currentPath] || notFound;

    document.title = pageTitles[currentPath] || "Mentia | Página no encontrada";;

    document.getElementById("app").innerHTML = pageToShow.render();

    pageToShow.mounted();

}

export function navigate(path) {

    history.pushState(null, null, path);

    router();

}
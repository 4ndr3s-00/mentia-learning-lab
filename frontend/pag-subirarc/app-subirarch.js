// =============================
// MENTIA - WORKSPACE DE CÓDIGO
// =============================

// Elementos del DOM
const textarea = document.querySelector("textarea");
const copyBtn = document.querySelector(".editor-actions button:first-child");
const fullscreenBtn = document.querySelector(".editor-actions button:last-child");
const fileInput = document.querySelector(".drop-area input");
const dropArea = document.querySelector(".drop-area");
const analyzeBtn = document.querySelector(".analyze");

// =============================
// COPIAR CÓDIGO
// =============================

copyBtn.addEventListener("click", () => {

    navigator.clipboard.writeText(textarea.value);

    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

    setTimeout(() => {

        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';

    }, 1500);

});

// =============================
// PANTALLA COMPLETA
// =============================

fullscreenBtn.addEventListener("click", () => {

    if (!document.fullscreenElement) {

        document.querySelector(".editor").requestFullscreen();

    } else {

        document.exitFullscreen();

    }

});

// =============================
// MOSTRAR ARCHIVO SELECCIONADO
// =============================

fileInput.addEventListener("change", () => {

    if(fileInput.files.length > 0){

        const archivo = fileInput.files[0];

        dropArea.querySelector("h3").textContent = archivo.name;

        dropArea.querySelector("p").textContent =
        "Archivo listo para analizar";

    }

});

// =============================
// DRAG & DROP
// =============================

dropArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    dropArea.style.borderColor="#5b3df5";

});

dropArea.addEventListener("dragleave",()=>{

    dropArea.style.borderColor="#d8d4ff";

});

dropArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    dropArea.style.borderColor="#d8d4ff";

    if(e.dataTransfer.files.length>0){

        fileInput.files=e.dataTransfer.files;

        const archivo=e.dataTransfer.files[0];

        dropArea.querySelector("h3").textContent=archivo.name;

        dropArea.querySelector("p").textContent="Archivo listo para analizar";

    }

});

// =============================
// BOTÓN ANALIZAR
// =============================

analyzeBtn.addEventListener("click",()=>{

    const codigo = textarea.value;

    const proyecto =
    document.querySelector("input").value;

    const lenguaje =
    document.querySelector("select").value;

    if(codigo.trim()===""){

        alert("Debes escribir o cargar un código.");

        return;

    }

    alert(

`Proyecto: ${proyecto}

Lenguaje: ${lenguaje}

Código enviado correctamente.

Aquí posteriormente se conectará la IA.`

    );

});
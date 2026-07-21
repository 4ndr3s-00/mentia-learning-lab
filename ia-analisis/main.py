"""
Correr con: uvicorn main:app --reload --port 8001 UwU
"""

import os
import json
import zipfile
import io
import requests
from typing import List
from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

app = FastAPI(title="Mentia - Análisis IA")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# lee todos los archivos de texto que hay dentro del zip y los junta en un solo texto
def leer_codigo_del_zip(bytes_zip: bytes) -> str:
    texto_completo = ""

    with zipfile.ZipFile(io.BytesIO(bytes_zip)) as zip_abierto:
        for nombre_archivo in zip_abierto.namelist():

            # nos saltamos las carpetas
            if nombre_archivo.endswith("/"):
                continue

            try:
                contenido = zip_abierto.read(nombre_archivo).decode("utf-8")
                texto_completo += f"\n--- archivo: {nombre_archivo} ---\n{contenido}\n"
            except UnicodeDecodeError:
                # si el archivo no es texto (imagen, etc), lo ignoramos
                continue

    return texto_completo


# junta el codigo de varios archivos subidos, sean sueltos (.py, .js, .html...) o un .zip
async def leer_codigo_de_archivos(archivos: List[UploadFile]) -> str:
    texto_completo = ""

    for archivo in archivos:
        bytes_archivo = await archivo.read()

        if archivo.filename.endswith(".zip"):
            # si es un zip, lo abrimos y sacamos todo el codigo de adentro
            texto_completo += leer_codigo_del_zip(bytes_archivo)
        else:
            # si es un archivo suelto, lo leemos directo
            try:
                contenido = bytes_archivo.decode("utf-8")
                texto_completo += f"\n--- archivo: {archivo.filename} ---\n{contenido}\n"
            except UnicodeDecodeError:
                # archivo que no es texto, lo ignoramos
                continue

    return texto_completo


def construir_prompt(titulo: str, lenguaje: str, codigo: str) -> str:
    return f"""
Eres un mentor técnico senior revisando la actividad de un estudiante de programación. Se muy riguroso: no inventes problemas que no esten realmente en el codigo, y no te saltes problemas reales que si esten.
Eres un mentor técnico revisando la actividad de un estudiante de programación.

Título de la actividad: {titulo}
Lenguaje: {lenguaje}

Código entregado:
```{lenguaje}
{codigo}
```

# antes de responder, revisa el codigo en dos pasadas:
1. primera pasada: lee el codigo completo, funcion por funcion, y para cada funcion simula mentalmente su ejecucion con casos normales, casos borde (0, negativos, vacio, null/None) y casos invalidos, para ver si realmente falla
2. segunda pasada: confirma cada problema que ibas a reportar releyendo la linea exacta del codigo donde ocurre, para no reportar nada que no este realmente escrito ahi (por ejemplo, no digas que una variable "no existe" sin antes revisar si fue definida arriba, en parametros, o en un scope superior)

# busca estos 4 tipos de problemas, en este orden de prioridad:
1. bugs de logica real (division por cero, casos borde sin manejar, recursion sin caso base, variables o funciones usadas antes de existir, comparaciones o condiciones que nunca se cumplen, off-by-one, tipos incompatibles, etc)
2. problemas de seguridad (contraseñas o credenciales quemadas en el codigo, falta de validacion de datos de entrada, inyeccion sql, eval de datos externos, etc)
# revisa el código a fondo, funcion por funcion, buscando estos 4 tipos de problemas:
1. bugs de logica real (division por cero, casos borde, recursion sin caso base, variables o funciones que no existen, etc)
2. problemas de seguridad (contraseñas o credenciales quemadas en el codigo, falta de validacion de datos, etc)
3. nombres enganosos (funciones o variables cuyo nombre no coincide con lo que realmente hacen)
4. imports que se agregan pero nunca se usan

# luego responde UNICAMENTE con el json válido, sin texto antes ni despues

{{
  "puntaje": <numero entero de 0 a 100>,
  "resumen": "<una frase corta resumiendo el analisis, sin simbolos raros>",
  "fortalezas": ["<punto fuerte 1>", "<punto fuerte 2>"],
  "debilidades": ["<problema 1, un solo problema por punto>", "<problema 2>", "<problema 3>"],
  "sugerencias": ["<sugerencia concreta 1>", "<sugerencia concreta 2>", "<sugerencia concreta 3>"]
}}

Reglas:
- cada debilidad y cada sugerencia debe nombrar la funcion afectada, por ejemplo: "en la funcion dividir(), ..."
- cada debilidad debe ser un problema real y verificable en el codigo entregado, no una suposicion generica ni un problema de codigo que no esta ahi
- no juntes varios problemas distintos en un mismo punto, cada uno va separado
- si encuentras problemas de los 4 tipos de arriba, cubrelos todos antes de repetir el mismo tipo
- si el codigo esta genuinamente bien y no encuentras problemas reales, dilo en vez de inventar debilidades menores
- no juntes varios problemas distintos en un mismo punto, cada uno va separado
- si encuentras problemas de los 4 tipos de arriba, cubrelos todos antes de repetir el mismo tipo
- se breve y directo en cada texto, nada de relleno ni simbolos de markdown dentro de los textos
"""


def limpiar_json(texto: str) -> dict:
    # en vez de adivinar si trae ``` o no, simplemente buscamos
    # donde empieza el { y donde termina el } y tomamos solo eso
    inicio = texto.find("{")
    fin = texto.rfind("}")

    if inicio == -1 or fin == -1:
        raise json.JSONDecodeError("No se encontro un json en la respuesta", texto, 0)

    texto_json = texto[inicio:fin + 1]
    return json.loads(texto_json)


@app.post("/analizar")
async def analizar_actividad(
    titulo: str = Form(...),
    lenguaje: str = Form(...),
    archivos: List[UploadFile] = None,
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Falta GEMINI_API_KEY en el .env")

    # lee el codigo de todos los archivos que subio el estudiante (sueltos o zip)
    codigo = await leer_codigo_de_archivos(archivos)

    if not codigo.strip():
        raise HTTPException(status_code=400, detail="No se pudo leer codigo de los archivos subidos.")

    # limite de caracteres que le mandamos a la ia, para no gastar tokens de mas
    # (6000 caracteres es de sobra para una actividad normal de estudiante)
    LIMITE_CARACTERES = 6000
    if len(codigo) > LIMITE_CARACTERES:
        codigo = codigo[:LIMITE_CARACTERES] + "\n\n(codigo recortado para ahorrar tokens)"

    generation_config = {
        "temperature": 0.2,        # baja para respuestas mas consistentes
        "maxOutputTokens": 2048,   # el analisis pide mas detalle, asi que necesita mas espacio para no cortarse
    }

    
    if "gemini-3" in GEMINI_MODEL:
        generation_config["thinkingConfig"] = {"thinkingLevel": "medium"}
    else:
        # gemini-2.5 y los alias como "gemini-flash-latest" piensan por defecto;
        # sin este limite gastan todo maxOutputTokens pensando y nunca escriben el json final
        generation_config["thinkingConfig"] = {"thinkingBudget": 1024}
        "maxOutputTokens": 2048,   # el analisis ahora pide mas detalle, asi que necesita mas espacio para no cortarse
    }

    # el parametro para "pensar menos" (ahorra tokens) cambia de nombre segun el modelo:
    # - gemini 3 usa "thinkingLevel"
    # - gemini 2.5 usa "thinkingBudget" (cantidad de tokens para pensar)
    # - los modelos mas viejos no soportan pensar, asi que no les mandamos nada
    if "gemini-3" in GEMINI_MODEL:
        generation_config["thinkingConfig"] = {"thinkingLevel": "low"}
    elif "gemini-2.5" in GEMINI_MODEL:
        generation_config["thinkingConfig"] = {"thinkingBudget": 512}

    payload = {
        "contents": [
            {"parts": [{"text": construir_prompt(titulo, lenguaje, codigo)}]}
        ],
        "generationConfig": generation_config,
    }
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    }

    respuesta = requests.post(GEMINI_URL, headers=headers, json=payload, timeout=60)

    if respuesta.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Error de Gemini: {respuesta.text}")

    data = respuesta.json()

    try:
        partes = data["candidates"][0]["content"]["parts"]
        # nos saltamos las partes de "pensamiento" (thought) del modelo, solo nos interesa la respuesta final
        texto_generado = "".join(p["text"] for p in partes if p.get("text") and not p.get("thought"))
        texto_generado = data["candidates"][0]["content"]["parts"][0]["text"]
        resultado = limpiar_json(texto_generado)
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        # si algo sale mal, mostramos la respuesta cruda para poder revisarla
        raise HTTPException(
            status_code=502,
            detail=f"No se pudo interpretar la respuesta de Gemini: {e}. Respuesta cruda: {data}",
        )

    return {
        "titulo": titulo,
        "lenguaje": lenguaje,
        "estado": "analizado",
        **resultado,
    }


@app.get("/")
def salud():
    return {"status": "ok", "modelo": GEMINI_MODEL}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)

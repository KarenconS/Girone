# Girone

Survival horror en primera persona con estética backrooms/retro, basado en los
9 círculos del Infierno de Dante. Sin combate: solo sigilo, huida y gestión de
recursos (linterna, batería).

## Estructura del repo

```
girone/
  client/     Vite + React + React Three Fiber (todo el motor del juego)
  server/     Node.js + Express + MongoDB (auth y guardado de progreso)
  AGENTS.md   Contexto del proyecto para agentes de IA (opencode)
```

El cliente es autosuficiente: todo el gameplay (movimiento, física, IA de
enemigos, generación de niveles) corre en el navegador. El servidor solo
gestiona login y progreso guardado.

---

## 1. Requisitos previos

Instala esto antes de tocar el proyecto:

| Herramienta | Versión | Enlace |
|---|---|---|
| Node.js | LTS (20.x o superior) | https://nodejs.org |
| Git | cualquier versión reciente | https://git-scm.com |
| Visual Studio Code | última | https://code.visualstudio.com |
| Cuenta de MongoDB Atlas | gratuita | https://www.mongodb.com/cloud/atlas |

Comprueba que Node y Git están bien instalados abriendo una terminal
(PowerShell) y ejecutando:

```powershell
node --version
npm --version
git --version
```

Si alguno de los tres da error de "comando no reconocido", reinstala esa
herramienta antes de seguir.

---

## 2. Clonar el repositorio

```powershell
git clone https://github.com/tu-usuario/girone.git
cd girone
```

Si vas a trabajar desde tu propia rama (por ejemplo, la rama `saul`):

```powershell
git checkout saul
```

---

## 3. Extensiones de VS Code

Al abrir la carpeta `girone` en VS Code, debería aparecer una notificación
abajo a la derecha: **"Este workspace tiene extensiones recomendadas"**.
Dale a **Instalar todo**.

Si no aparece, instálalas manualmente desde la pestaña de Extensiones
(`Ctrl+Shift+X`), buscando cada una:

- **ESLint** (`dbaeumer.vscode-eslint`) — detecta errores de JS en tiempo real
- **Prettier** (`esbenp.prettier-vscode`) — formatea el código automáticamente
- **ES7+ React/Redux snippets** (`dsznajder.es7-react-js-snippets`) — atajos para componentes React
- **MongoDB for VS Code** (`mongodb.mongodb-vscode`) — explorar la base de datos sin salir del editor
- **DotENV** (`mikestead.dotenv`) — resalta la sintaxis de los archivos `.env`
- **GitLens** (`eamodio.gitlens`) — ver historial y autoría de cada línea
- **Error Lens** (`usernamehw.errorlens`) — muestra los errores en línea, no solo en la pestaña de problemas

---

## 4. Instalar dependencias

El proyecto tiene dos `package.json` independientes — hay que instalar en cada carpeta:

```powershell
cd client
npm install
cd ..\server
npm install
cd ..
```

---

## 5. Configurar variables de entorno

El servidor necesita un archivo `.env` que **no está en el repo** (por seguridad,
mira el `.gitignore`). Créalo tú mismo:

```powershell
cd server
New-Item .env
notepad .env
```

Pega esto dentro, sustituyendo los valores por los tuyos:

```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/girone
JWT_SECRET=escribe-aqui-algo-largo-y-aleatorio
PORT=4000
```

Pídele a quien tenga acceso al proyecto de MongoDB Atlas que te invite y te
pase la connection string real (`MONGO_URI`). El `JWT_SECRET` puede ser
cualquier cadena larga random — no tiene que coincidir con la de otros
compañeros en desarrollo local.

---

## 6. Arrancar el proyecto

Necesitas dos terminales abiertas a la vez (una para cada parte):

**Terminal 1 — cliente:**
```powershell
cd client
npm run dev
```
Se abrirá en `http://localhost:5173`

**Terminal 2 — servidor:**
```powershell
cd server
npm run dev
```
Escuchando en `http://localhost:4000`

---

## 7. Instalar opencode (agente de IA para programar desde la terminal)

Con Node.js ya instalado (paso 1), basta con:

```powershell
npm install -g opencode-ai@latest
```

Cierra y reabre la terminal, y comprueba:

```powershell
opencode --version
```

**Si da error de `/bin/sh.exe` o "cannot execute binary file"** (fallo
conocido del instalador en Windows), activa el Modo Desarrollador:

`Configuración de Windows` → `Privacidad y seguridad` → `Para desarrolladores`
→ activar **Modo desarrollador**, y luego reinstala:

```powershell
npm install -g opencode-ai@latest --force
```

Una vez funcione, sitúate en la raíz del repo y ejecútalo — leerá
automáticamente el `AGENTS.md` del proyecto con todo el contexto de Girone:

```powershell
cd girone
opencode
```

La primera vez te pedirá conectar un proveedor de IA (Anthropic, OpenAI,
etc.) con `/connect` dentro de la propia interfaz.

---

## 8. Flujo de trabajo con Git

- `main` es la rama estable — no se hacen commits directos ahí.
- Cada persona trabaja en su propia rama (`saul`, etc.).
- Cuando algo esté listo, se abre un Pull Request hacia `main` en GitHub para
  revisarlo antes de fusionar.

Comandos básicos del día a día:

```powershell
git checkout saul              # cambiar a tu rama
git pull origin saul           # traer los últimos cambios de tu rama
# ... trabajas, editas archivos ...
git add .
git commit -m "Descripción breve de lo que has hecho"
git push origin saul
```

---

## 9. Convenciones del proyecto

Ver `AGENTS.md` en la raíz del repo — contiene el contexto completo del
diseño del juego (los 9 círculos, sus perseguidores, arquitectura técnica)
que también usa opencode para entender el proyecto.

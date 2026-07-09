# AGENTS.md

## Repo overview

Two packages: `client/` (empty, frontend placeholder) and `server/` (Express 5 + Mongoose 9 API).

## Server

- **Entrypoint:** `server/index.js`. Express 5 ESM app using `dotenv/config`.
- **ESM:** `server/package.json` has `"type": "module"`. All imports use `.js` extensions.
- **Routes:** `/api/auth` (register/login with JWT + bcrypt), `/api/progress` (save/load `GameSave` upserted per user).
- **Auth middleware:** `server/middleware/auth.js` — reads `Authorization: Bearer <token>`, sets `req.userId`.
- **Dev:** `npm run dev` in `server/` — runs `nodemon index.js`.
- **Test:** not configured (`npm test` prints error).
- **Env:** copy `server/.env` template; requires `MONGO_URI`, `JWT_SECRET`, `PORT`.
- **Models:** `User` (username unique, passwordHash) and `GameSave` (userId ref, currentCircle, checkpoints[], deaths).

# Girone — juego de terror survival basado en el Infierno de Dante

## Concepto
Survival horror en primera persona, estética backrooms/retro (PS1 low-poly, 
niebla densa, luz fluorescente). 9 niveles = 9 círculos del Infierno + Vestíbulo.
Sin combate: el jugador huye y se esconde, nunca ataca.

## Estructura del repo
- `client/` — Vite + React + React Three Fiber. El motor del juego vive 100% 
  aquí (render, física, IA de enemigos, generación procedural).
- `server/` — Node.js + Express + Mongoose. Solo hace auth (JWT) y guarda 
  progreso/partidas. NO participa en el gameplay en tiempo real.
- `client/src/scenes/` — una carpeta por círculo (Vestibulo, Limbo, Lujuria...)
- `client/src/entities/` — Player.jsx, ChaserAI.jsx
- `client/src/systems/` — mazeGenerator.js, MazeRoom.jsx, save-system
- `client/src/store/` — gameStore.js (zustand)

## Stack técnico
Cliente: React Three Fiber, @react-three/drei, @react-three/rapier (física), 
@react-three/postprocessing (niebla/grano), zustand (estado), howler (audio).
Servidor: Express, Mongoose, jsonwebtoken, bcrypt. MongoDB Atlas.

## Convenciones de código
- Componentes de escena en PascalCase.jsx
- Un `RigidBody` de Rapier por objeto físico; nunca física manual.
- Cada círculo reutiliza `MazeRoom` + `ChaserAI`, solo cambian parámetros 
  (paleta de color, densidad de laberinto, tipo de perseguidor).

## Los 9 círculos y su perseguidor (en orden, sin saltarse ninguno)
1. Vestíbulo/Aqueronte — sin enemigo, tutorial de movimiento
2. Limbo — sin enemigo, tutorial de sigilo/linterna/guardado
3. Lujuria — El Vendaval (corriente de aire que empuja)
4. Gula — Cerbero (persecución por sonido direccional)
5. Avaricia/Prodigalidad — El Peso (bola/roca en pasillos estrechos)
6. Ira/Pereza — Ahogado del Estigia (aparece si corres/haces ruido)
7. Herejía — La Llama Errante (sigue rastro de calor)
8. Violencia — El Centauro (patrulla zonas, no tocar el "río")
9. Fraude (Malebolge) — El Impostor (se disfraza de NPC amistoso)
10. Traición (Cocito/Giudecca) — Presencia de Lucifer (gestión de frío como recurso)

## IA del perseguidor (patrón reutilizable)
Máquina de estados: Patrulla → Alerta (ruido/línea de visión) → Persecución → 
Búsqueda (último punto visto) → vuelve a Patrulla. Implementar una sola vez 
como componente parametrizable, no repetir por círculo.

## Estado actual del proyecto
- [x] Nombre decidido: Girone
- [x] Arquitectura cliente/servidor definida
- [x] Player.jsx (movimiento FPS + linterna con batería) — código base ya escrito
- [x] mazeGenerator.js (recursive backtracker) — código base ya escrito
- [ ] App.jsx uniendo Player + MazeRoom + niebla
- [ ] ChaserAI.jsx (Cerbero)
- [ ] Backend Express (auth + progreso)

## Comandos útiles
- `cd client && npm run dev` — arrancar cliente
- `cd server && npm run dev` — arrancar servidor (nodemon)
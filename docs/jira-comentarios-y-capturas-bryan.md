# Bryan Gualpa — Comentarios Jira + Capturas para mañana

Copia y pega cada comentario en la subtarea correspondiente de Jira.
Adjunta capturas con el botón **+** en la sección **Attachments** (como Brandon).

---

## CÓMO SUBIR CAPTURAS EN JIRA (como Brandon)

1. Abre tu tarea en Jira (ej: API-S1 o PG3-332).
2. Baja hasta la sección **Attachments**.
3. Clic en el **+** (o arrastra la imagen).
4. Selecciona la captura de pantalla.
5. Repite para cada evidencia (código, Swagger, Postman, Slack, GitHub).

## CÓMO ESCRIBIR ACTIVITY (como Brandon)

1. En la misma tarea, pestaña **Comments** (Activity).
2. Clic en **Add a comment...**
3. Pega el texto de abajo (uno por subtarea).
4. Clic **Save** o **Comment**.

---

# SPRINT 1 — API-S1 (tus subtareas)

## Subtarea 1 — Node.js + TypeScript
**Comentario:**
```
Se configuró la estructura base del backend con Node.js y TypeScript: package.json, tsconfig.json, ESLint, Prettier y carpetas src/{config, controllers, middleware, models, routes, utils}.

Commit: feat: setup backend infrastructure, database connection and JWT authentication
Enlace: https://github.com/ravivanco/ProyectoInterculturalidad-G3/commit/1e5396e
```
**Capturas:** estructura carpetas backend, package.json, tsconfig.json

---

## Subtarea 3 — PostgreSQL + migraciones
**Comentario:**
```
Se configuró la conexión a PostgreSQL con Sequelize, pool de conexiones y migración inicial con tablas users, patient_profiles y nutritionist_profiles. Variables en .env.example.

Commit: 1e5396e
Archivos: backend/src/config/database.ts, backend/migrations/
```
**Capturas:** database.ts, migración SQL/JS, .env.example

---

## Subtarea 5 — JWT roles paciente/nutricionista
**Comentario:**
```
Se implementó autenticación JWT con roles paciente y nutricionista: access token, refresh token, middleware authGuard y roleGuard. Endpoints POST /auth/register, POST /auth/login, POST /auth/refresh.

Commit: 1e5396e
Archivos: authController.ts, authGuard.ts, roleGuard.ts, jwt.ts, authRoutes.ts
```
**Capturas:** authController.ts, authGuard.ts, Swagger /auth/login

---

## Subtarea 7 — Swagger /api-docs
**Comentario:**
```
Se configuró Swagger UI en /api-docs con swagger-jsdoc y swagger-ui-express. Documentados endpoints de autenticación y pacientes del Sprint 1.

Commit: 1e5396e
Archivo: backend/src/config/swagger.ts
```
**Capturas:** navegador en localhost:3000/api-docs

---

## Subtarea 9 — Pruebas Postman
**Comentario:**
```
Se creó colección Postman con casos: registro paciente, login paciente, login nutricionista, GET /patients, GET /health. Exportada al repositorio.

Commit: 1e5396e
Archivo: backend/tests/ProyectoInterculturalidad-G3.postman_collection.json
```
**Capturas:** Postman con request exitoso (200/201), colección en el repo

---

# SPRINT 2 — API-S2 (tus subtareas)

## PG3-157 — POST /api/clinical-evaluations
**Comentario:**
```
Se implementó POST /api/clinical-evaluations con cálculo automático de IMC a partir de peso y estatura (acepta metros o centímetros). Solo nutricionista. Estima calorías si no se envían.

Commit: 023d45c
PR: https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
Archivo: backend/src/routes/clinicalEvaluationRoutes.ts
```
**Capturas:** código calculateBmi, Swagger POST clinical-evaluations, respuesta 201 en Postman/Swagger

---

## PG3-161 — GET /api/patients ajustado
**Comentario:**
```
Se ajustó GET /api/patients con búsqueda por email (ILIKE), filtro por estado_tratamiento (pendiente/activo/finalizado), paginación y orden por fecha.

Commit: 375c8fe
PR: https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
Archivo: backend/src/routes/patientRoutes.ts
```
**Capturas:** patientRoutes.ts filtros, Swagger GET /patients con query params

---

## PG3-163 — Dashboard calórico
**Comentario:**
```
Se completó GET /api/calorie-control/dashboard: retorna meta calórica y macros (25% proteína, 45% carbohidratos, 30% grasas) desde la última evaluación clínica del paciente.

Commit: 023d45c
PR: https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
Archivo: backend/src/routes/calorieControlRoutes.ts
```
**Capturas:** calorieControlRoutes.ts, respuesta JSON del dashboard

---

# SPRINT 3 — API-S3 (tus subtareas — PRIORIDAD MAÑANA)

## PG3-332 — CRUD /api/foods
**Comentario:**
```
Se implementó el catálogo de alimentos: modelo Food, CRUD completo en /api/foods con búsqueda por nombre, filtro por categoría y paginación. Escritura solo para nutricionista.

Commit: 914601b
Issue: https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
Archivos: Food.ts, foodRoutes.ts
```
**Capturas:** foodRoutes.ts, Swagger Foods, GET /foods respuesta 200

---

## PG3-334 — Cloudinary
**Comentario:**
```
Se configuró Cloudinary y endpoint POST /api/uploads/image con multer (memoria, máx 5MB, solo imágenes). Retorna URL segura de Cloudinary.

Commit: 914601b
Issue: https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
Archivos: cloudinary.ts, uploadRoutes.ts
```
**Capturas:** uploadRoutes.ts, respuesta upload con URL Cloudinary

---

## PG3-336 — Generador plan semanal
**Comentario:**
```
Se implementó POST /api/recipe-generator/generate-week: genera plan de 7 días distribuyendo alimentos del catálogo según meta calórica (25% desayuno, 35% almuerzo, 15% merienda, 25% cena).

Commit: 914601b
Issue: https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
Archivo: recipeGeneratorRoutes.ts
```
**Capturas:** recipeGeneratorRoutes.ts, respuesta JSON plan semanal 7 días

---

# CAPTURAS QUE DEBES LLEVAR MAÑANA

## Carpeta recomendada en tu PC
Crea: `C:\Users\Personal\Desktop\Evidencias_Bryan_Gualpa\`

```
Evidencias_Bryan_Gualpa/
├── Sprint1/
│   ├── 01-estructura-backend.png
│   ├── 02-database-migracion.png
│   ├── 03-jwt-auth.png
│   ├── 04-swagger-s1.png
│   └── 05-postman-s1.png
├── Sprint2/
│   ├── 01-clinical-evaluations.png
│   ├── 02-patients-filtros.png
│   ├── 03-dashboard-calorico.png
│   ├── 04-github-pr4.png
│   └── 05-slack-s2.png
├── Sprint3/          ← MÁS IMPORTANTE
│   ├── 01-foods-crud.png
│   ├── 02-cloudinary-upload.png
│   ├── 03-generador-semanal.png
│   ├── 04-swagger-s3.png
│   ├── 05-github-issue5.png
│   └── 06-slack-s3.png
├── Notion/
│   └── pagina-evidencias.png
└── Documentos/
    ├── Bryan_Gualpa_Guia_Defensa_S1_S2_S3.docx
    └── notion-evidencias-bryan-gualpa.md
```

## Archivos que YA tienes (no necesitas buscarlos)
| Archivo | Ubicación |
|---------|-----------|
| Guía defensa | `Desktop\Bryan_Gualpa_Guia_Defensa_S1_S2_S3.docx` |
| Evidencias Notion | `Desktop\notion-evidencias-bryan-gualpa.md` |
| Postman S1 | `backend\tests\ProyectoInterculturalidad-G3.postman_collection.json` |
| Código S3 | `backend\src\routes\foodRoutes.ts`, `uploadRoutes.ts`, `recipeGeneratorRoutes.ts` |

## Capturas que debes TOMAR HOY (si no las tienes)
1. **VS Code** — abre cada archivo de arriba → Win+Shift+S
2. **Swagger** — `http://localhost:3000/api-docs` → prueba endpoints S3
3. **GitHub** — PR #4, Issue #5, commit 1e5396e
4. **Slack** — #github con tus notificaciones
5. **Jira** — tablero con tus tareas Done

---

# ¿DEPENDEN DE OTROS O SON INDEPENDIENTES?

## Respuesta corta para el ingeniero
> "Mis tareas son **independientes en responsabilidad** pero **secuenciales en el proyecto**: Sprint 1 pone la base, Sprint 2 usa auth y DB de S1, Sprint 3 usa el catálogo y evaluaciones de sprints anteriores. Yo programé **mi parte** en cada sprint; Brandon complementó Express, health y deploy en S1, y dishes en S3."

## Tabla de dependencias

| Sprint | Tu trabajo | ¿Depende de otros? | ¿Qué es tuyo solo? |
|--------|-----------|-------------------|-------------------|
| **S1** | Base API | Parcial — Brandon hizo Express y /health | Node+TS, DB, JWT, Swagger, Postman |
| **S2** | Evaluaciones, patients, dashboard | Usa JWT/DB de S1 (infra compartida) | POST clinical-evaluations, ajuste GET patients, dashboard macros |
| **S3** | Foods, Cloudinary, generador | Usa auth de S1 y evaluaciones de S2 para calorías | CRUD /foods, upload Cloudinary, generate-week |

## Cómo defender si pregunta dependencias
- **S1:** "Trabajo conjunto con Brandon. Yo: infraestructura, BD, JWT, Swagger. Él: Express, health, deploy."
- **S2:** "Mis endpoints son independientes; usan la autenticación que yo configuré en S1."
- **S3:** "Mis 3 endpoints son míos. Brandon hizo dishes en la misma rama, pero PG3-332, 334 y 336 son exclusivamente míos."

---

# ORDEN PARA HOY (1 hora)

1. Crear carpeta `Desktop\Evidencias_Bryan_Gualpa\`
2. Tomar las 15 capturas listadas arriba
3. En Jira: abrir cada subtarea → pegar comentario → adjuntar captura con **+**
4. Marcar Done las que falten
5. Llevar mañana: carpeta de capturas + Word guía defensa + enlace Notion

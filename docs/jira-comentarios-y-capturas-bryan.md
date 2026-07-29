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

---

# SPRINT 4 — API-S4 (Bryan Gualpa — PG3-341 a PG3-346)

Rama: `feature/API-S4-tracking-comidas-ejercicios-gemini-vision`  
Base GitHub: https://github.com/ravivanco/ProyectoInterculturalidad-G3/tree/feature/API-S4-tracking-comidas-ejercicios-gemini-vision

| Subtarea Jira | Nombre archivo captura | Qué capturar | Comentario Jira (pegar en Activity) |
|---------------|------------------------|--------------|-------------------------------------|
| PG3-341 | `S4-PG3-341-tracking-comidas-vscode.png` | `backend/src/routes/trackingRoutes.ts` POST/GET `/meals` | Se implementó registro e historial de ingestas del paciente (POST/GET `/api/tracking/meals`) con `meal_logs` y JWT. Commit en rama `feature/API-S4-tracking-comidas-ejercicios-gemini-vision`. |
| PG3-341 | `S4-PG3-341-swagger-meals.png` | Swagger `/api-docs` sección Tracking S4 — meals | Mismo endpoint documentado en OpenAPI; prueba 201 con token paciente. |
| PG3-342 | `S4-PG3-342-tracking-ejercicios-vscode.png` | Mismo archivo — bloque `/exercises` | POST/GET `/api/tracking/exercises` para sesiones realizadas (PG3-342), modelo `ExerciseLog`. |
| PG3-342 | `S4-PG3-342-postman-ejercicio-201.png` | Postman POST exercises respuesta 201 | Evidencia de registro de ejercicio con `exerciseName`, `durationMinutes`, `completedAt`. |
| PG3-343 | `S4-PG3-343-peso-vscode.png` | Bloque `/weight` en trackingRoutes | Registro y consulta de peso (`weight_logs`) — PG3-343. |
| PG3-343 | `S4-PG3-343-peso-json.png` | Respuesta GET `/api/tracking/weight` | Curva/listado ordenado por `loggedAt`. |
| PG3-344 | `S4-PG3-344-consumo-extra-vscode.png` | Bloque `/extra-consumptions` | Consumos fuera del menú con calorías e `imageUrl` opcional — PG3-344. |
| PG3-344 | `S4-PG3-344-consumo-extra-postman.png` | POST extra-consumptions 201 | Cuerpo JSON con description, calories, loggedAt. |
| PG3-345 | `S4-PG3-345-gemini-vscode.png` | `backend/src/routes/visionRoutes.ts` | POST `/api/vision/food-image` — Gemini Vision o modo demo si no hay API key — PG3-345. |
| PG3-345 | `S4-PG3-345-gemini-respuesta.png` | JSON con estimatedCalories | Respuesta `{ description, estimatedCalories, confidence }`. |
| PG3-346 | `S4-PG3-346-summary-vscode.png` | GET `/tracking/summary` en trackingRoutes | Resumen agregado (conteos, calorías extra, último peso) — PG3-346. |
| PG3-346 | `S4-PG3-346-summary-swagger.png` | Swagger summary + query from/to | Filtros de periodo para dashboards web/móvil. |
| PG3-339 (padre) | `S4-PG3-339-github-rama-api-s4.png` | GitHub → Commits rama API-S4 | Historial commits Bryan: modelos, tracking, vision, router. |
| PG3-340 (contenedor) | `S4-PG3-340-jira-tablero-done.png` | Jira subtareas 341–346 en Done | Vista tablero Sitio B Sprint 4. |

**Nota:** PG3-347 (Swagger Sprint 4 completo) suele ir con **Brandon**; tú puedes adjuntar `S4-PG3-347-swagger-tracking-vision.png` de `/api-docs` mostrando tags **Tracking S4** y **Vision S4** como apoyo.

---

# SPRINT 5 — API-S5 (Bryan Gualpa — PG3-350, 351, 352, 353, 354, 355, 495)

Rama: `feature/API-S5-dashboard-nutricionista` (incluye commits de API-S4)  
GitHub: https://github.com/ravivanco/ProyectoInterculturalidad-G3/tree/feature/API-S5-dashboard-nutricionista

| Subtarea Jira | Nombre archivo captura | Qué capturar | Comentario Jira |
|---------------|------------------------|--------------|-----------------|
| PG3-350 | `S5-PG3-350-modelo-alertas-vscode.png` | `backend/src/models/PatientAlert.ts` + migración S5 | Modelo de alertas de adherencia (`patient_alerts`) — PG3-350. |
| PG3-351 | `S5-PG3-351-adherence-service.png` | `backend/src/services/adherenceService.ts` | Servicio `computeAdherence` (KPI alimentario/físico/global) — PG3-351. |
| PG3-351 | `S5-PG3-351-adherence-json.png` | GET `/api/dashboard/nutritionist/adherence?patientId=` | Respuesta JSON `scorePercent`, meals/exercises logged. |
| PG3-352 | `S5-PG3-352-alertas-evaluate-vscode.png` | POST `/nutritionist/alerts/evaluate` en dashboardNutritionistRoutes | Reglas automáticas (adherencia &lt;60%, consumo extra, sin comidas hoy) — PG3-352. |
| PG3-352 | `S5-PG3-352-alertas-creadas-postman.png` | Respuesta 201 con array `created` | Alertas generadas en BD. |
| PG3-353 | `S5-PG3-353-dashboard-nutricionista.png` | GET `/api/dashboard/nutritionist` | Panel consolidado adherencia + alertas abiertas — PG3-353. |
| PG3-354 | `S5-PG3-354-listado-alertas.png` | GET `/api/dashboard/nutritionist/alerts` | Flags/estado `acknowledged` — PG3-354. |
| PG3-355 | `S5-PG3-355-filtros-query.png` | Swagger o Postman con `from`, `to`, `adherenceType` | Filtros de dashboard — PG3-355. |
| PG3-495 | `S5-PG3-495-adherence-detail.png` | GET `/api/dashboard/nutritionist/adherence/detail` | Extensión S5: desglose alimentaria/física/global — PG3-495. |
| PG3-554 | `S5-PG3-554-swagger-s5.png` | `/api-docs` tags Dashboard S5 + Tracking S4 | Documentación OpenAPI Sprint 5 (compartida con Brandon). |
| PG3-348 (historia) | `S5-PG3-348-github-commits.png` | GitHub commits rama API-S5 | Trazabilidad API-S5 dashboard nutricionista. |
| PG3-349 (contenedor) | `S5-PG3-349-jira-done.png` | Jira subtareas 350–355, 495 Done | Evidencia gestión Sprint 5 Sitio B. |

---

## Carpeta recomendada (S4 + S5)

```
Desktop\Evidencias_Bryan_Gualpa\Sprint4\
Desktop\Evidencias_Bryan_Gualpa\Sprint5\
```

## Comandos locales (demo defensa)

```powershell
cd backend
npm run dev
# Swagger: http://localhost:3000/api-docs
# Migrar: npm run db:migrate
```

## Commits realizados (referencia)

- **API-S4:** `feat(API-S4): migraciones y modelos…` → tracking routes → vision → router.
- **API-S5:** adherencia + alertas → dashboard routes → swagger.

Push (cuando tengas red):

```powershell
git push -u origin feature/API-S4-tracking-comidas-ejercicios-gemini-vision
git push -u origin feature/API-S5-dashboard-nutricionista
```

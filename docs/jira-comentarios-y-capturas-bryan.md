# Bryan Gualpa ÔÇö Comentarios Jira + Capturas para ma├▒ana

Copia y pega cada comentario en la subtarea correspondiente de Jira.
Adjunta capturas con el bot├│n **+** en la secci├│n **Attachments** (como Brandon).

---

## C├ôMO SUBIR CAPTURAS EN JIRA (como Brandon)

1. Abre tu tarea en Jira (ej: API-S1 o PG3-332).
2. Baja hasta la secci├│n **Attachments**.
3. Clic en el **+** (o arrastra la imagen).
4. Selecciona la captura de pantalla.
5. Repite para cada evidencia (c├│digo, Swagger, Postman, Slack, GitHub).

## C├ôMO ESCRIBIR ACTIVITY (como Brandon)

1. En la misma tarea, pesta├▒a **Comments** (Activity).
2. Clic en **Add a comment...**
3. Pega el texto de abajo (uno por subtarea).
4. Clic **Save** o **Comment**.

---

# SPRINT 1 ÔÇö API-S1 (tus subtareas)

## Subtarea 1 ÔÇö Node.js + TypeScript
**Comentario:**
```
Se configur├│ la estructura base del backend con Node.js y TypeScript: package.json, tsconfig.json, ESLint, Prettier y carpetas src/{config, controllers, middleware, models, routes, utils}.

Commit: feat: setup backend infrastructure, database connection and JWT authentication
Enlace: https://github.com/ravivanco/ProyectoInterculturalidad-G3/commit/1e5396e
```
**Capturas:** estructura carpetas backend, package.json, tsconfig.json

---

## Subtarea 3 ÔÇö PostgreSQL + migraciones
**Comentario:**
```
Se configur├│ la conexi├│n a PostgreSQL con Sequelize, pool de conexiones y migraci├│n inicial con tablas users, patient_profiles y nutritionist_profiles. Variables en .env.example.

Commit: 1e5396e
Archivos: backend/src/config/database.ts, backend/migrations/
```
**Capturas:** database.ts, migraci├│n SQL/JS, .env.example

---

## Subtarea 5 ÔÇö JWT roles paciente/nutricionista
**Comentario:**
```
Se implement├│ autenticaci├│n JWT con roles paciente y nutricionista: access token, refresh token, middleware authGuard y roleGuard. Endpoints POST /auth/register, POST /auth/login, POST /auth/refresh.

Commit: 1e5396e
Archivos: authController.ts, authGuard.ts, roleGuard.ts, jwt.ts, authRoutes.ts
```
**Capturas:** authController.ts, authGuard.ts, Swagger /auth/login

---

## Subtarea 7 ÔÇö Swagger /api-docs
**Comentario:**
```
Se configur├│ Swagger UI en /api-docs con swagger-jsdoc y swagger-ui-express. Documentados endpoints de autenticaci├│n y pacientes del Sprint 1.

Commit: 1e5396e
Archivo: backend/src/config/swagger.ts
```
**Capturas:** navegador en localhost:3000/api-docs

---

## Subtarea 9 ÔÇö Pruebas Postman
**Comentario:**
```
Se cre├│ colecci├│n Postman con casos: registro paciente, login paciente, login nutricionista, GET /patients, GET /health. Exportada al repositorio.

Commit: 1e5396e
Archivo: backend/tests/ProyectoInterculturalidad-G3.postman_collection.json
```
**Capturas:** Postman con request exitoso (200/201), colecci├│n en el repo

---

# SPRINT 2 ÔÇö API-S2 (tus subtareas)

## PG3-157 ÔÇö POST /api/clinical-evaluations
**Comentario:**
```
Se implement├│ POST /api/clinical-evaluations con c├ílculo autom├ítico de IMC a partir de peso y estatura (acepta metros o cent├¡metros). Solo nutricionista. Estima calor├¡as si no se env├¡an.

Commit: 023d45c
PR: https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
Archivo: backend/src/routes/clinicalEvaluationRoutes.ts
```
**Capturas:** c├│digo calculateBmi, Swagger POST clinical-evaluations, respuesta 201 en Postman/Swagger

---

## PG3-161 ÔÇö GET /api/patients ajustado
**Comentario:**
```
Se ajust├│ GET /api/patients con b├║squeda por email (ILIKE), filtro por estado_tratamiento (pendiente/activo/finalizado), paginaci├│n y orden por fecha.

Commit: 375c8fe
PR: https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
Archivo: backend/src/routes/patientRoutes.ts
```
**Capturas:** patientRoutes.ts filtros, Swagger GET /patients con query params

---

## PG3-163 ÔÇö Dashboard cal├│rico
**Comentario:**
```
Se complet├│ GET /api/calorie-control/dashboard: retorna meta cal├│rica y macros (25% prote├¡na, 45% carbohidratos, 30% grasas) desde la ├║ltima evaluaci├│n cl├¡nica del paciente.

Commit: 023d45c
PR: https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
Archivo: backend/src/routes/calorieControlRoutes.ts
```
**Capturas:** calorieControlRoutes.ts, respuesta JSON del dashboard

---

# SPRINT 3 ÔÇö API-S3 (tus subtareas ÔÇö PRIORIDAD MA├æANA)

## PG3-332 ÔÇö CRUD /api/foods
**Comentario:**
```
Se implement├│ el cat├ílogo de alimentos: modelo Food, CRUD completo en /api/foods con b├║squeda por nombre, filtro por categor├¡a y paginaci├│n. Escritura solo para nutricionista.

Commit: 914601b
Issue: https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
Archivos: Food.ts, foodRoutes.ts
```
**Capturas:** foodRoutes.ts, Swagger Foods, GET /foods respuesta 200

---

## PG3-334 ÔÇö Cloudinary
**Comentario:**
```
Se configur├│ Cloudinary y endpoint POST /api/uploads/image con multer (memoria, m├íx 5MB, solo im├ígenes). Retorna URL segura de Cloudinary.

Commit: 914601b
Issue: https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
Archivos: cloudinary.ts, uploadRoutes.ts
```
**Capturas:** uploadRoutes.ts, respuesta upload con URL Cloudinary

---

## PG3-336 ÔÇö Generador plan semanal
**Comentario:**
```
Se implement├│ POST /api/recipe-generator/generate-week: genera plan de 7 d├¡as distribuyendo alimentos del cat├ílogo seg├║n meta cal├│rica (25% desayuno, 35% almuerzo, 15% merienda, 25% cena).

Commit: 914601b
Issue: https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
Archivo: recipeGeneratorRoutes.ts
```
**Capturas:** recipeGeneratorRoutes.ts, respuesta JSON plan semanal 7 d├¡as

---

# CAPTURAS QUE DEBES LLEVAR MA├æANA

## Carpeta recomendada en tu PC
Crea: `C:\Users\Personal\Desktop\Evidencias_Bryan_Gualpa\`

```
Evidencias_Bryan_Gualpa/
Ôö£ÔöÇÔöÇ Sprint1/
Ôöé   Ôö£ÔöÇÔöÇ 01-estructura-backend.png
Ôöé   Ôö£ÔöÇÔöÇ 02-database-migracion.png
Ôöé   Ôö£ÔöÇÔöÇ 03-jwt-auth.png
Ôöé   Ôö£ÔöÇÔöÇ 04-swagger-s1.png
Ôöé   ÔööÔöÇÔöÇ 05-postman-s1.png
Ôö£ÔöÇÔöÇ Sprint2/
Ôöé   Ôö£ÔöÇÔöÇ 01-clinical-evaluations.png
Ôöé   Ôö£ÔöÇÔöÇ 02-patients-filtros.png
Ôöé   Ôö£ÔöÇÔöÇ 03-dashboard-calorico.png
Ôöé   Ôö£ÔöÇÔöÇ 04-github-pr4.png
Ôöé   ÔööÔöÇÔöÇ 05-slack-s2.png
Ôö£ÔöÇÔöÇ Sprint3/          ÔåÉ M├üS IMPORTANTE
Ôöé   Ôö£ÔöÇÔöÇ 01-foods-crud.png
Ôöé   Ôö£ÔöÇÔöÇ 02-cloudinary-upload.png
Ôöé   Ôö£ÔöÇÔöÇ 03-generador-semanal.png
Ôöé   Ôö£ÔöÇÔöÇ 04-swagger-s3.png
Ôöé   Ôö£ÔöÇÔöÇ 05-github-issue5.png
Ôöé   ÔööÔöÇÔöÇ 06-slack-s3.png
Ôö£ÔöÇÔöÇ Notion/
Ôöé   ÔööÔöÇÔöÇ pagina-evidencias.png
ÔööÔöÇÔöÇ Documentos/
    Ôö£ÔöÇÔöÇ Bryan_Gualpa_Guia_Defensa_S1_S2_S3.docx
    ÔööÔöÇÔöÇ notion-evidencias-bryan-gualpa.md
```

## Archivos que YA tienes (no necesitas buscarlos)
| Archivo | Ubicaci├│n |
|---------|-----------|
| Gu├¡a defensa | `Desktop\Bryan_Gualpa_Guia_Defensa_S1_S2_S3.docx` |
| Evidencias Notion | `Desktop\notion-evidencias-bryan-gualpa.md` |
| Postman S1 | `backend\tests\ProyectoInterculturalidad-G3.postman_collection.json` |
| C├│digo S3 | `backend\src\routes\foodRoutes.ts`, `uploadRoutes.ts`, `recipeGeneratorRoutes.ts` |

## Capturas que debes TOMAR HOY (si no las tienes)
1. **VS Code** ÔÇö abre cada archivo de arriba ÔåÆ Win+Shift+S
2. **Swagger** ÔÇö `http://localhost:3000/api-docs` ÔåÆ prueba endpoints S3
3. **GitHub** ÔÇö PR #4, Issue #5, commit 1e5396e
4. **Slack** ÔÇö #github con tus notificaciones
5. **Jira** ÔÇö tablero con tus tareas Done

---

# ┬┐DEPENDEN DE OTROS O SON INDEPENDIENTES?

## Respuesta corta para el ingeniero
> "Mis tareas son **independientes en responsabilidad** pero **secuenciales en el proyecto**: Sprint 1 pone la base, Sprint 2 usa auth y DB de S1, Sprint 3 usa el cat├ílogo y evaluaciones de sprints anteriores. Yo program├® **mi parte** en cada sprint; Brandon complement├│ Express, health y deploy en S1, y dishes en S3."

## Tabla de dependencias

| Sprint | Tu trabajo | ┬┐Depende de otros? | ┬┐Qu├® es tuyo solo? |
|--------|-----------|-------------------|-------------------|
| **S1** | Base API | Parcial ÔÇö Brandon hizo Express y /health | Node+TS, DB, JWT, Swagger, Postman |
| **S2** | Evaluaciones, patients, dashboard | Usa JWT/DB de S1 (infra compartida) | POST clinical-evaluations, ajuste GET patients, dashboard macros |
| **S3** | Foods, Cloudinary, generador | Usa auth de S1 y evaluaciones de S2 para calor├¡as | CRUD /foods, upload Cloudinary, generate-week |

## C├│mo defender si pregunta dependencias
- **S1:** "Trabajo conjunto con Brandon. Yo: infraestructura, BD, JWT, Swagger. ├ël: Express, health, deploy."
- **S2:** "Mis endpoints son independientes; usan la autenticaci├│n que yo configur├® en S1."
- **S3:** "Mis 3 endpoints son m├¡os. Brandon hizo dishes en la misma rama, pero PG3-332, 334 y 336 son exclusivamente m├¡os."

---

# ORDEN PARA HOY (1 hora)

1. Crear carpeta `Desktop\Evidencias_Bryan_Gualpa\`
2. Tomar las 15 capturas listadas arriba
3. En Jira: abrir cada subtarea ÔåÆ pegar comentario ÔåÆ adjuntar captura con **+**
4. Marcar Done las que falten
5. Llevar ma├▒ana: carpeta de capturas + Word gu├¡a defensa + enlace Notion

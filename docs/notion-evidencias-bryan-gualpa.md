# Bryan Alexander Gualpa Meza — Evidencias completas (Sprint 1, 2 y 3)

**Proyecto:** DK-FITT — Grupo 3  
**Sitio:** B — Backend API (Quito)  
**Correo:** bagualpa@espe.edu.ec | **GitHub:** BryanGualpa  
**Repo:** https://github.com/ravivanco/ProyectoInterculturalidad-G3

---

# ⭐ SPRINT 3 — PRIORIDAD PARA LA DEFENSA (mañana)

## Resumen oral (30 segundos)
> "En el Sprint 3 implementé el catálogo de alimentos (PG3-332), la subida de imágenes a Cloudinary (PG3-334) y el generador automático de plan semanal (PG3-336). Todo está en la rama API-S3, documentado en el Issue #5 de GitHub y notificado en Slack #github."

## Jira — Mis subtareas Sprint 3

| ID | Tarea | Endpoint |
|----|-------|----------|
| PG3-332 | Catálogo de alimentos | CRUD `/api/foods` |
| PG3-334 | Cloudinary | `POST /api/uploads/image` |
| PG3-336 | Generador IA | `POST /api/recipe-generator/generate-week` |

## GitHub — Enlaces Sprint 3

- **Issue #5:** https://github.com/ravivanco/ProyectoInterculturalidad-G3/issues/5
- **PR equipo (mi comentario):** https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/1
- **Rama:** https://github.com/ravivanco/ProyectoInterculturalidad-G3/tree/feature/API-S3-catalogo-alimentos-platos-cloudinary-generador-ia
- **Commits:** `914601b` (código) · `4d0dc00` (comentarios) · `c5140f6` (documentación)

## Archivos que programé (Sprint 3)

- `backend/src/models/Food.ts`
- `backend/src/routes/foodRoutes.ts`
- `backend/src/config/cloudinary.ts`
- `backend/src/routes/uploadRoutes.ts`
- `backend/src/routes/recipeGeneratorRoutes.ts`

## Slack — Evidencia Sprint 3

- Canal **#github**
- Commit: *1 new commit pushed* — `c5140f6` — BryanGualpa
- Issue: *Issue created by BryanGualpa* — #5
- **[PEGAR CAPTURA AQUÍ EN NOTION]**

## Demo rápida (si preguntan)

1. Swagger `/api-docs` → sección Foods, Uploads, Recipe Generator
2. `GET /api/foods` — listar catálogo
3. `POST /api/uploads/image` — subir imagen
4. `POST /api/recipe-generator/generate-week` — plan 7 días

---

# SPRINT 2 — API-S2 (respaldo)

**Rama:** `feature/API-S2-endpoints-evaluaciones-clinicas-planes-control-calorico`

## Jira

| ID | Tarea |
|----|-------|
| PG3-157 | POST `/api/clinical-evaluations` (IMC automático) |
| PG3-161 | GET `/api/patients` (email, estado, paginación) |
| PG3-163 | GET `/api/calorie-control/dashboard` (macros) |

## GitHub

- **PR #4:** https://github.com/ravivanco/ProyectoInterculturalidad-G3/pull/4
- **Commits:** `023d45c` · `375c8fe` · `5e3dae9`

## Slack

- *Pull request opened by BryanGualpa* — API-S2
- **[PEGAR CAPTURA AQUÍ EN NOTION]**

---

# SPRINT 1 — API-S1 (infraestructura base)

**Épica:** EPIC-API-01 | **Historia:** API-S1  
**Rama:** `feature/API-S1-setup-infraestructura`  
**Colaborador:** Brandon Fonseca

## Mis subtareas Sprint 1 (Brayan Gualpa)

| # | Subtarea | Qué hice en código |
|---|----------|-------------------|
| 1 | Node.js + TypeScript | `package.json`, `tsconfig.json`, `.eslintrc`, estructura `src/` |
| 3 | PostgreSQL + migraciones | `database.ts`, `config.json`, migración `create-initial-tables` |
| 5 | JWT roles paciente/nutricionista | `authController.ts`, `authGuard.ts`, `roleGuard.ts`, `jwt.ts`, `/auth/*` |
| 7 | Swagger `/api-docs` | `swagger.ts`, documentación endpoints Sprint 1 |
| 9 | Pruebas Postman | `ProyectoInterculturalidad-G3.postman_collection.json` |

## GitHub — Enlaces Sprint 1

- **Commit principal (Bryan Gualpa):** https://github.com/ravivanco/ProyectoInterculturalidad-G3/commit/1e5396e
- **Rama S1:** https://github.com/ravivanco/ProyectoInterculturalidad-G3/tree/feature/API-S1-setup-infraestructura
- **Mensaje commit:** `feat: setup backend infrastructure, database connection and JWT authentication`

## Brandon en S1 (mencionar en defensa)

- Subtareas 2, 4, 6, 8: Express, `/health`, GET patients, Deploy Render

## Slack — Sprint 1 (crear evidencia hoy)

Como S1 no tiene Issue/PR tuyo, **crea Issue #6** en GitHub:

**Título:** `API-S1 — Bryan Gualpa — Infraestructura, JWT, Swagger, Postman`  
**Cuerpo:** pegar sección Sprint 1 de este documento + enlace commit `1e5396e`

Eso generará notificación en **#github**.

## Jira — Comentario para API-S1

En cada subtarea tuya (1, 3, 5, 7, 9) comentar:
```
Evidencia: https://github.com/ravivanco/ProyectoInterculturalidad-G3/commit/1e5396e
Notion: [enlace de esta página]
```

---

# NOTION — Dónde pegar cada cosa

| Sección Notion | Qué pegar |
|----------------|-----------|
| **Título página** | Bryan Gualpa — Evidencias DK-FITT S1 S2 S3 |
| **Bloque Sprint 3** | Enlaces Issue #5, PR #1, capturas Slack |
| **Bloque Sprint 2** | Enlace PR #4, captura Slack |
| **Bloque Sprint 1** | Enlace commit 1e5396e, Issue #6 (crear hoy) |
| **Al final** | Enlace informe e-Gov si el docente lo pide |

---

# Checklist antes de mañana

- [ ] Notion con 3 secciones (S1, S2, S3)
- [ ] Capturas Slack #github (S2 y S3 mínimo)
- [ ] Issue #5 (S3) — ya hecho
- [ ] Issue #6 (S1) — crear hoy
- [ ] PR #4 (S2) — ya hecho
- [ ] Jira: comentarios con URLs en PG3-332, 334, 336 (prioridad)
- [ ] Probar Swagger localmente por si piden demo S3

---

# Guión defensa (2 minutos total)

**Sprint 3 (1 min):** PG3-332 foods CRUD, PG3-334 Cloudinary, PG3-336 generador semanal. Issue #5, commits en rama API-S3, Slack #github.

**Sprint 2 (30 seg):** Evaluaciones clínicas con IMC, ajuste listado pacientes, dashboard calórico. PR #4.

**Sprint 1 (30 seg):** Base del backend: Node+TS, PostgreSQL, JWT con roles, Swagger y colección Postman. Commit 1e5396e. Trabajo conjunto con Brandon en Express y deploy.

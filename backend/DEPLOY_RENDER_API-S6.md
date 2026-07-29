# API-S6 — Deploy Render y variables de producción (PG3-360)

**Responsable:** Bryan Gualpa (Sitio B)  
**Épica:** EPIC-API-06 — Producción y calidad  
**Jira:** https://richarfd199-espe-team.atlassian.net/browse/PG3-356

## Variables de entorno (Render Dashboard → Environment)

| Variable | Obligatoria | Uso |
|----------|-------------|-----|
| `NODE_ENV` | Sí | `production` |
| `DATABASE_URL` | Sí | PostgreSQL (Render o externo) |
| `JWT_SECRET` | Sí | Tokens acceso |
| `JWT_REFRESH_SECRET` | Sí | Refresh tokens |
| `ENABLE_SWAGGER` | Recomendada | `true` para evidencia PG3-362 en `/api-docs` |
| `CLOUDINARY_*` | Si S3 activo | Uploads |
| `GEMINI_API_KEY` | Opcional | Visión PG3-345 |

## Evidencia Jira / Notion

1. Captura del servicio **Live** en Render (URL + último deploy exitoso).
2. Captura `GET https://<tu-app>.onrender.com/health` (200 OK).
3. Comentario en **PG3-360** con URL del deploy.

## Local (antes de subir)

```powershell
cd backend
npm run build
npm run dev
```

Verificar: http://localhost:3000/health

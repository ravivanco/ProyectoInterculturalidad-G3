/**
 * Servidor DEMO para capturas Jira S4/S5 — sin PostgreSQL.
 * Uso: npm run dev:capturas
 * NO reemplaza el API real; solo evidencia visual en Swagger/navegador.
 */
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

const PORT = Number(process.env.PORT) || 3000;

const DEMO_PATIENT_ID = '11111111-1111-4111-8111-111111111111';
const DEMO_NUTRI_TOKEN = 'demo-nutri-token-capturas';
const DEMO_PATIENT_TOKEN = 'demo-patient-token-capturas';

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'DK-FITT API — Demo capturas S4/S5 (Bryan Gualpa)',
    version: 'demo-capturas',
    description:
      'Respuestas simuladas para evidencias Jira. Para API real: Docker + npm run dev.',
  },
  servers: [{ url: `http://localhost:${PORT}`, description: 'Demo local capturas' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth demo', description: 'Login de prueba' },
    { name: 'Tracking S4', description: 'PG3-341 a PG3-346' },
    { name: 'Vision S4', description: 'PG3-345' },
    { name: 'Dashboard S5', description: 'PG3-350 a PG3-355, PG3-495' },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth demo'],
        summary: 'Login demo (copiar accessToken)',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  email: 'nutri.demo@g3.local',
                  password: 'Demo1234!',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token demo',
          },
        },
      },
    },
    '/api/tracking/meals': {
      post: {
        tags: ['Tracking S4'],
        summary: 'PG3-341 — Registrar comida',
        responses: { '201': { description: 'Created' } },
      },
      get: {
        tags: ['Tracking S4'],
        summary: 'PG3-341 — Historial comidas',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/tracking/exercises': {
      post: {
        tags: ['Tracking S4'],
        summary: 'PG3-342 — Registrar ejercicio',
        responses: { '201': { description: 'Created' } },
      },
      get: {
        tags: ['Tracking S4'],
        summary: 'PG3-342 — Historial ejercicios',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/tracking/weight': {
      post: {
        tags: ['Tracking S4'],
        summary: 'PG3-343 — Registrar peso',
        responses: { '201': { description: 'Created' } },
      },
      get: {
        tags: ['Tracking S4'],
        summary: 'PG3-343 — Historial peso',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/tracking/extra-consumptions': {
      post: {
        tags: ['Tracking S4'],
        summary: 'PG3-344 — Consumo adicional',
        responses: { '201': { description: 'Created' } },
      },
      get: {
        tags: ['Tracking S4'],
        summary: 'PG3-344 — Listado consumos extra',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/tracking/summary': {
      get: {
        tags: ['Tracking S4'],
        summary: 'PG3-346 — Resumen agregado',
        parameters: [
          { name: 'patientId', in: 'query', schema: { type: 'string' } },
          { name: 'from', in: 'query', schema: { type: 'string' } },
          { name: 'to', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/vision/food-image': {
      post: {
        tags: ['Vision S4'],
        summary: 'PG3-345 — Gemini / demo visión',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/dashboard/nutritionist/adherence': {
      get: {
        tags: ['Dashboard S5'],
        summary: 'PG3-351 — KPI adherencia',
        parameters: [
          { name: 'patientId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'adherenceType', in: 'query', schema: { type: 'string', enum: ['global', 'alimentaria', 'fisica'] } },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/dashboard/nutritionist/alerts/evaluate': {
      post: {
        tags: ['Dashboard S5'],
        summary: 'PG3-352 — Generar alertas',
        parameters: [{ name: 'patientId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '201': { description: 'Created' } },
      },
    },
    '/api/dashboard/nutritionist': {
      get: {
        tags: ['Dashboard S5'],
        summary: 'PG3-353 — Panel nutricionista',
        parameters: [
          { name: 'patientId', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'from', in: 'query', schema: { type: 'string' } },
          { name: 'to', in: 'query', schema: { type: 'string' } },
          { name: 'adherenceType', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/dashboard/nutritionist/alerts': {
      get: {
        tags: ['Dashboard S5'],
        summary: 'PG3-354 — Listado alertas',
        parameters: [{ name: 'patientId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/dashboard/nutritionist/adherence/detail': {
      get: {
        tags: ['Dashboard S5'],
        summary: 'PG3-495 — Detalle adherencia',
        parameters: [{ name: 'patientId', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' } },
      },
    },
  },
};

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const authOptional = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  next();
};

app.get('/health', (_req, res) => {
  res.json({ success: true, mode: 'demo-capturas', message: 'OK sin PostgreSQL' });
});

app.get('/capturas', (_req, res) => {
  const q = (path: string) => `http://localhost:${PORT}${path}`;
  const pid = DEMO_PATIENT_ID;
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/>
<title>DK-FITT — Links capturas Bryan S4/S5</title>
<style>body{font-family:Segoe UI,sans-serif;margin:24px;max-width:960px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:left}a{color:#0563C1}h2{margin-top:28px}</style></head><body>
<h1>Enlaces para capturas (demo local)</h1>
<p>Servidor <strong>demo-capturas</strong>. Swagger: <a href="${q('/api-docs')}">${q('/api-docs')}</a></p>
<p>Token nutricionista demo (Authorize): <code>Bearer ${DEMO_NUTRI_TOKEN}</code></p>
<p>patientId demo: <code>${pid}</code></p>
<h2>PG3-347 — Swagger + Postman Sprint 4</h2>
<p><a href="${q('/api-docs')}">Swagger — todos los endpoints Tracking S4 y Vision S4</a></p>
<p>Postman: importar <code>backend/tests/ProyectoInterculturalidad-G3.postman_collection.json</code> y entorno <code>DK-FITT-S4.postman_environment.json</code></p>
<table><tr><th>Jira</th><th>Link</th></tr>
<tr><td>PG3-341 GET meals</td><td><a href="${q('/api/tracking/meals')}">${q('/api/tracking/meals')}</a></td></tr>
<tr><td>PG3-342 GET exercises</td><td><a href="${q('/api/tracking/exercises')}">${q('/api/tracking/exercises')}</a></td></tr>
<tr><td>PG3-343 GET weight</td><td><a href="${q('/api/tracking/weight')}">${q('/api/tracking/weight')}</a></td></tr>
<tr><td>PG3-344 GET extra</td><td><a href="${q('/api/tracking/extra-consumptions')}">${q('/api/tracking/extra-consumptions')}</a></td></tr>
<tr><td>PG3-346 summary</td><td><a href="${q(`/api/tracking/summary?patientId=${pid}&from=2026-07-23&to=2026-07-27`)}">summary con filtros</a></td></tr>
</table>
<h2>Sprint 5 — GET (clic directo)</h2>
<table><tr><th>Jira</th><th>Link</th></tr>
<tr><td>PG3-351</td><td><a href="${q(`/api/dashboard/nutritionist/adherence?patientId=${pid}&adherenceType=global`)}">adherence</a></td></tr>
<tr><td>PG3-353</td><td><a href="${q(`/api/dashboard/nutritionist?patientId=${pid}`)}">dashboard</a></td></tr>
<tr><td>PG3-354</td><td><a href="${q(`/api/dashboard/nutritionist/alerts?patientId=${pid}`)}">alerts</a></td></tr>
<tr><td>PG3-355</td><td><a href="${q(`/api/dashboard/nutritionist?patientId=${pid}&from=2026-07-23&to=2026-07-27&adherenceType=alimentaria`)}">dashboard filtros</a></td></tr>
<tr><td>PG3-495</td><td><a href="${q(`/api/dashboard/nutritionist/adherence/detail?patientId=${pid}`)}">adherence detail</a></td></tr>
</table>
<h2>Sprint 4/5 — POST (usar Swagger Try it out)</h2>
<p><a href="${q('/api-docs')}">Abrir Swagger</a> → Auth login → copiar token → Authorize → probar POST meals, vision, alerts/evaluate.</p>
</body></html>`;
  res.type('html').send(html);
});

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '');
  const isNutri = email.includes('nutri');
  res.json({
    success: true,
    data: {
      accessToken: isNutri ? DEMO_NUTRI_TOKEN : DEMO_PATIENT_TOKEN,
      refreshToken: 'demo-refresh-token-capturas',
      user: {
        id: isNutri ? '22222222-2222-4222-8222-222222222222' : DEMO_PATIENT_ID,
        role: isNutri ? 'nutricionista' : 'paciente',
        email,
      },
    },
  });
});

app.post('/api/tracking/meals', authOptional, (_req, res) => {
  res.status(201).json({
    success: true,
    data: { id: 'meal-demo-1', mealType: 'almuerzo', calories: 450, loggedAt: new Date().toISOString() },
  });
});
app.get('/api/tracking/meals', authOptional, (_req, res) => {
  res.json({ success: true, data: [{ mealType: 'almuerzo', calories: 450 }] });
});

app.post('/api/tracking/exercises', authOptional, (_req, res) => {
  res.status(201).json({
    success: true,
    data: { exerciseName: 'Caminata', durationMinutes: 30, completedAt: new Date().toISOString() },
  });
});
app.get('/api/tracking/exercises', authOptional, (_req, res) => {
  res.json({ success: true, data: [{ exerciseName: 'Caminata', durationMinutes: 30 }] });
});

app.post('/api/tracking/weight', authOptional, (_req, res) => {
  res.status(201).json({ success: true, data: { weightKg: 72.5, loggedAt: new Date().toISOString() } });
});
app.get('/api/tracking/weight', authOptional, (_req, res) => {
  res.json({ success: true, data: [{ weightKg: 72.5, loggedAt: '2026-07-27T08:00:00.000Z' }] });
});

app.post('/api/tracking/extra-consumptions', authOptional, (_req, res) => {
  res.status(201).json({ success: true, data: { description: 'Galletas', calories: 180 } });
});
app.get('/api/tracking/extra-consumptions', authOptional, (_req, res) => {
  res.json({ success: true, data: [{ description: 'Galletas', calories: 180 }] });
});

app.get('/api/tracking/summary', authOptional, (req, res) => {
  res.json({
    success: true,
    data: {
      patientId: req.query.patientId || DEMO_PATIENT_ID,
      counts: { meals: 12, exercises: 5, weightEntries: 7, extraConsumptions: 2 },
      extraCaloriesTotal: 360,
      lastWeightKg: 72.5,
    },
  });
});

app.post('/api/vision/food-image', authOptional, (_req, res) => {
  res.json({
    success: true,
    data: { description: 'Ensalada mixta (demo)', estimatedCalories: 220, confidence: 'mock' },
  });
});

const adherencePayload = {
  patientId: DEMO_PATIENT_ID,
  kind: 'global',
  scorePercent: 78,
  mealsLogged: 12,
  exercisesLogged: 5,
  extraCalories: 360,
  dailyCalorieTarget: null,
  period: { from: '2026-07-23T00:00:00.000Z', to: '2026-07-27T00:00:00.000Z' },
};

app.get('/api/dashboard/nutritionist/adherence', authOptional, (_req, res) => {
  res.json({ success: true, data: adherencePayload });
});

app.post('/api/dashboard/nutritionist/alerts/evaluate', authOptional, (_req, res) => {
  res.status(201).json({
    success: true,
    data: {
      created: [
        { alertType: 'adherencia_baja', message: 'Adherencia global 78%', severity: 'info', acknowledged: false },
      ],
      adherence: adherencePayload,
    },
  });
});

app.get('/api/dashboard/nutritionist', authOptional, (req, res) => {
  res.json({
    success: true,
    data: {
      filters: req.query,
      adherence: adherencePayload,
      openAlerts: [{ alertType: 'comida_pendiente', message: 'Recordatorio demo', acknowledged: false }],
    },
  });
});

app.get('/api/dashboard/nutritionist/alerts', authOptional, (_req, res) => {
  res.json({
    success: true,
    data: [{ alertType: 'consumo_extra', message: 'Consumo adicional 360 kcal', acknowledged: false }],
  });
});

app.get('/api/dashboard/nutritionist/adherence/detail', authOptional, (_req, res) => {
  res.json({
    success: true,
    data: {
      alimentaria: { ...adherencePayload, kind: 'alimentaria', scorePercent: 82 },
      fisica: { ...adherencePayload, kind: 'fisica', scorePercent: 71 },
      global: adherencePayload,
    },
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.listen(PORT, () => {
  console.log(`Demo capturas S4/S5 → http://localhost:${PORT}/capturas`);
  console.log(`Swagger          → http://localhost:${PORT}/api-docs`);
});

# PG3-361 — Pruebas E2E del flujo completo

## Objetivo

Validar el funcionamiento integrado del backend DK-FITT mediante un flujo de extremo a extremo que cubra los módulos principales del sistema.

## Flujo validado

1. Registro del paciente.
2. Inicio de sesión.
3. Onboarding del paciente.
4. Creación de evaluación clínica.
5. Creación y activación del plan nutricional.
6. Registro de comidas.
7. Registro de consumo adicional.
8. Consulta de adherencia.
9. Generación automática de alertas.
10. Consulta y gestión de alertas.
11. Registro y gestión de citas.

## Entorno de pruebas

- Backend: Node.js
- Lenguaje: TypeScript
- Framework: Express
- Base de datos: PostgreSQL
- ORM: Sequelize
- Herramientas: Swagger y Postman
- URL base: http://localhost:3000/api

## Pruebas ejecutadas

### 1. Registro del paciente

Se verificó la creación de un usuario con rol paciente.

Resultado esperado:

- Código HTTP 200 o 201.
- Usuario creado correctamente.
- Obtención del identificador del paciente.

### 2. Inicio de sesión

Se validó la autenticación mediante JWT.

Resultado esperado:

- Código HTTP 200.
- Token de acceso generado.
- Acceso permitido a rutas protegidas.

### 3. Onboarding del paciente

Se validó el registro de información inicial del paciente.

Resultado esperado:

- Perfil actualizado.
- Datos personales y nutricionales almacenados.
- Código HTTP 200.

### 4. Evaluación clínica

Se verificó la creación de una evaluación clínica vinculada al paciente.

Resultado esperado:

- Registro de peso, talla e indicadores clínicos.
- Evaluación vinculada correctamente.
- Código HTTP 201.

### 5. Plan nutricional

Se comprobó la creación y activación de un plan nutricional.

Resultado esperado:

- Plan creado para el paciente.
- Plan activado correctamente.
- Código HTTP 200 o 201.

### 6. Registro de comidas

Se validó el registro de comidas y macronutrientes.

Resultado esperado:

- Comida almacenada.
- Calorías y macronutrientes registrados.
- Código HTTP 200 o 201.

### 7. Consumo adicional

Endpoint principal:

POST /api/additional-intake

Resultado esperado:

- Consumo adicional creado.
- Información nutricional almacenada.
- Código HTTP 201.

### 8. Consulta de adherencia

Se comprobó el cálculo de adherencia del paciente.

Resultado esperado:

- Porcentaje de adherencia disponible.
- Información del cumplimiento del plan.
- Código HTTP 200.

### 9. Evaluación automática de alertas

Endpoint:

POST /api/alerts/evaluate

Resultado esperado:

- Evaluación ejecutada correctamente.
- Generación de alertas cuando se cumplen las condiciones.
- Código HTTP 200.

### 10. Gestión de alertas

Endpoints:

GET /api/alerts

PATCH /api/alerts/:id/read

PATCH /api/alerts/:id/resolve

Resultado esperado:

- Consulta de alertas registradas.
- Cambio de estado a leída.
- Cambio de estado a resuelta.
- Código HTTP 200.

### 11. Gestión de citas

Endpoints:

POST /api/appointments

GET /api/appointments

PATCH /api/appointments/:id/status

PATCH /api/appointments/:id/link-evaluation

DELETE /api/appointments/:id

Resultado esperado:

- Cita creada correctamente.
- Consulta de citas con filtros.
- Estado actualizado.
- Evaluación clínica vinculada.
- Cita eliminada correctamente.

## Resultados generales

El flujo E2E permitió comprobar la integración entre:

- Autenticación.
- Pacientes.
- Evaluaciones clínicas.
- Planes nutricionales.
- Registro de comidas.
- Consumos adicionales.
- Adherencia.
- Alertas automáticas.
- Dashboard del nutricionista.
- Gestión de citas.

## Evidencias

Se adjuntarán las siguientes evidencias:

- Capturas de Swagger.
- Capturas de Postman.
- Respuestas HTTP exitosas.
- Registros almacenados en PostgreSQL.
- Captura de la terminal con el servidor activo.
- Captura del commit.
- Captura del Pull Request.
- Evidencia del Collection Runner de Postman.

## Conclusión

Las pruebas E2E permitieron validar el funcionamiento integrado del backend DK-FITT. Los módulos principales respondieron correctamente y mantuvieron la persistencia de los datos en PostgreSQL.

La implementación cumple con el flujo solicitado en la tarea PG3-361.
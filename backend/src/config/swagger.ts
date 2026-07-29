// API-S1 — Swagger UI /api-docs (Bryan Gualpa)
import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DK-FITT API - Sitio B (Quito)',
      version: '1.0.0',
      description:
        'API for DK-FITT Sitio B (Quito) supporting authentication, patient profiling, foods, dishes, nutrition weeks, day menus and AI recipe generation.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['paciente', 'nutricionista'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        PatientProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            estado_tratamiento: {
              type: 'string',
              enum: ['pendiente', 'activo', 'finalizado'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        Food: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Pollo' },
            tipo: { type: 'string', example: 'Proteína' },
            calorias: { type: 'number', example: 165 },
            unidad: { type: 'string', example: 'g' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },

        FoodCreateRequest: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Arroz' },
            tipo: { type: 'string', example: 'Carbohidrato' },
            calorias: { type: 'number', example: 130 },
            unidad: { type: 'string', example: 'g' },
          },
        },

        FoodUpdateRequest: {
          type: 'object',
          properties: {
            nombre: { type: 'string', example: 'Arroz integral' },
            tipo: { type: 'string', example: 'Carbohidrato' },
            calorias: { type: 'number', example: 120 },
            unidad: { type: 'string', example: 'g' },
          },
        },

        Dish: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ensalada de pollo' },
            tipo_comida: { type: 'string', example: 'Almuerzo' },
            calorias_total: { type: 'number', example: 450 },
            imagen_url: {
              type: 'string',
              example: 'https://ejemplo.com/ensalada.jpg',
            },
            preparacion: {
              type: 'string',
              example: 'Cocinar el pollo, cortar verduras y mezclar.',
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },

        DishIngredient: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            dish_id: { type: 'integer', example: 1 },
            food_id: { type: 'integer', example: 2 },
            cantidad: { type: 'number', example: 150 },
            unidad: { type: 'string', example: 'g' },
          },
        },

        DishCreateRequest: {
          type: 'object',
          required: ['nombre', 'tipo_comida'],
          properties: {
            nombre: { type: 'string', example: 'Ensalada de pollo' },
            tipo_comida: { type: 'string', example: 'Almuerzo' },
            calorias_total: { type: 'number', example: 450 },
            imagen_url: {
              type: 'string',
              example: 'https://ejemplo.com/ensalada.jpg',
            },
            preparacion: {
              type: 'string',
              example: 'Cocinar el pollo, cortar verduras y mezclar.',
            },
            ingredientes: {
              type: 'array',
              items: {
                type: 'object',
                required: ['food_id', 'cantidad', 'unidad'],
                properties: {
                  food_id: { type: 'integer', example: 1 },
                  cantidad: { type: 'number', example: 150 },
                  unidad: { type: 'string', example: 'g' },
                },
              },
            },
          },
        },

        DishUpdateRequest: {
          type: 'object',
          properties: {
            nombre: { type: 'string', example: 'Ensalada actualizada' },
            tipo_comida: { type: 'string', example: 'Cena' },
            calorias_total: { type: 'number', example: 390 },
            imagen_url: {
              type: 'string',
              example: 'https://ejemplo.com/nueva-imagen.jpg',
            },
            preparacion: {
              type: 'string',
              example: 'Preparar pollo, verduras y servir frío.',
            },
            ingredientes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  food_id: { type: 'integer', example: 1 },
                  cantidad: { type: 'number', example: 120 },
                  unidad: { type: 'string', example: 'g' },
                },
              },
            },
          },
        },

        PlanWeekCreateRequest: {
          type: 'object',
          properties: {
            week_number: { type: 'integer', example: 1 },
            start_date: {
              type: 'string',
              format: 'date',
              example: '2026-07-08',
            },
            end_date: {
              type: 'string',
              format: 'date',
              example: '2026-07-12',
            },
            days: {
              type: 'array',
              items: { type: 'string' },
              example: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
            },
            meal_times: {
              type: 'array',
              items: { type: 'string' },
              example: [
                'desayuno',
                'media_manana',
                'almuerzo',
                'media_tarde',
                'cena',
              ],
            },
          },
        },

        DayMenuCreateRequest: {
          type: 'object',
          required: ['meal_time', 'dish_id'],
          properties: {
            meal_time: {
              type: 'string',
              example: 'almuerzo',
            },
            dish_id: {
              type: 'integer',
              example: 1,
            },
            notes: {
              type: 'string',
              example: 'Porción normal para almuerzo.',
            },
          },
        },

        RecipeGeneratorRequest: {
          type: 'object',
          properties: {
            plan_id: {
              type: 'string',
              example: 'plan-demo-1',
            },
            objective: {
              type: 'string',
              example:
                'Crear menú semanal saludable para paciente con control calórico.',
            },
            calories_target: {
              type: 'number',
              example: 1800,
            },
            preferences: {
              type: 'array',
              items: { type: 'string' },
              example: ['pollo', 'arroz', 'verduras'],
            },
            restrictions: {
              type: 'array',
              items: { type: 'string' },
              example: ['sin azúcar', 'bajo en grasa'],
            },
          },
        },
      },
    },

    paths: {
      '/foods': {
        get: {
          summary: 'Listar alimentos',
          description:
            'Obtiene el catálogo de alimentos registrados. Permite filtrar por nombre o tipo.',
          tags: ['Foods'],
          parameters: [
            {
              name: 'nombre',
              in: 'query',
              required: false,
              schema: { type: 'string', example: 'pollo' },
            },
            {
              name: 'tipo',
              in: 'query',
              required: false,
              schema: { type: 'string', example: 'Proteína' },
            },
          ],
          responses: {
            200: { description: 'Lista de alimentos obtenida correctamente' },
            500: { description: 'Error interno del servidor' },
          },
        },

        post: {
          summary: 'Crear alimento',
          description: 'Crea un nuevo alimento dentro del catálogo nutricional.',
          tags: ['Foods'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FoodCreateRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Alimento creado correctamente' },
            400: { description: 'Datos inválidos' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },

      '/foods/{id}': {
        get: {
          summary: 'Obtener alimento por ID',
          description: 'Obtiene el detalle de un alimento específico.',
          tags: ['Foods'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: { description: 'Alimento obtenido correctamente' },
            404: { description: 'Alimento no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },

        put: {
          summary: 'Actualizar alimento',
          description: 'Actualiza la información de un alimento existente.',
          tags: ['Foods'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FoodUpdateRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Alimento actualizado correctamente' },
            404: { description: 'Alimento no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },

        delete: {
          summary: 'Eliminar alimento',
          description: 'Elimina un alimento del catálogo.',
          tags: ['Foods'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: { description: 'Alimento eliminado correctamente' },
            404: { description: 'Alimento no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },

      '/dishes': {
        post: {
          summary: 'Crear un plato',
          description: 'Crea un nuevo plato con sus ingredientes.',
          tags: ['Dishes'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DishCreateRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Plato creado correctamente' },
            400: { description: 'Datos inválidos' },
            500: { description: 'Error interno del servidor' },
          },
        },

        get: {
          summary: 'Listar platos',
          description:
            'Obtiene el catálogo de platos. Permite filtrar por nombre y tipo de comida.',
          tags: ['Dishes'],
          parameters: [
            {
              name: 'tipo_comida',
              in: 'query',
              required: false,
              schema: { type: 'string', example: 'Almuerzo' },
            },
            {
              name: 'nombre',
              in: 'query',
              required: false,
              schema: { type: 'string', example: 'pollo' },
            },
          ],
          responses: {
            200: { description: 'Lista de platos obtenida correctamente' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },

      '/dishes/{id}': {
        get: {
          summary: 'Obtener plato por ID',
          description:
            'Obtiene un plato específico con sus ingredientes y preparación.',
          tags: ['Dishes'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: { description: 'Detalle del plato obtenido correctamente' },
            404: { description: 'Plato no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },

        put: {
          summary: 'Actualizar plato',
          description:
            'Actualiza los datos de un plato existente y sus ingredientes.',
          tags: ['Dishes'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DishUpdateRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Plato actualizado correctamente' },
            404: { description: 'Plato no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },

      '/nutrition-plans/{planId}/weeks': {
        post: {
          summary: 'Crear estructura semanal',
          description:
            'Crea la estructura semanal de un plan nutricional con días y tiempos de comida.',
          tags: ['Nutrition Weeks'],
          parameters: [
            {
              name: 'planId',
              in: 'path',
              required: true,
              schema: { type: 'string', example: 'plan-demo-1' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PlanWeekCreateRequest',
                },
              },
            },
          },
          responses: {
            201: { description: 'Estructura semanal creada correctamente' },
            400: { description: 'Datos inválidos' },
            500: { description: 'Error interno del servidor' },
          },
        },

        get: {
          summary: 'Consultar semanas del plan',
          description:
            'Obtiene las semanas asociadas a un plan nutricional.',
          tags: ['Nutrition Weeks'],
          parameters: [
            {
              name: 'planId',
              in: 'path',
              required: true,
              schema: { type: 'string', example: 'plan-demo-1' },
            },
          ],
          responses: {
            200: { description: 'Semanas obtenidas correctamente' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },

      '/weeks/{weekId}/days/{day}/menus': {
        post: {
          summary: 'Asignar plato a menú diario',
          description:
            'Asigna un plato a un día específico y a un tiempo de comida.',
          tags: ['Week Menus'],
          parameters: [
            {
              name: 'weekId',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
            {
              name: 'day',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                example: 'lunes',
                enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DayMenuCreateRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Menú asignado correctamente' },
            400: { description: 'Datos inválidos' },
            404: { description: 'Semana o plato no encontrado' },
            500: { description: 'Error interno del servidor' },
          },
        },

        get: {
          summary: 'Consultar menús de un día',
          description:
            'Obtiene los menús asignados a un día específico de una semana.',
          tags: ['Week Menus'],
          parameters: [
            {
              name: 'weekId',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
            {
              name: 'day',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                example: 'lunes',
                enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
              },
            },
          ],
          responses: {
            200: { description: 'Menús obtenidos correctamente' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },

      '/recipe-generator/generate-week': {
        post: {
          summary: 'Generar menú semanal con IA',
          description:
            'Genera una propuesta de menú semanal usando IA según preferencias, restricciones y objetivo calórico.',
          tags: ['Recipe Generator'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RecipeGeneratorRequest',
                },
              },
            },
          },
          responses: {
            200: { description: 'Menú semanal generado correctamente' },
            400: { description: 'Datos inválidos' },
            500: { description: 'Error interno del servidor' },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📝 Swagger Docs available at http://localhost:${PORT}/api-docs`);
  } else {
    console.log('📝 Swagger Docs disabled in production environment');
  }
};

export default swaggerSpec;
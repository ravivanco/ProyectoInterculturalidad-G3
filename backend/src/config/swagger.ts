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
        'API for DK-FITT Sitio B (Quito) supporting authentication, patient profiling and dish management.',
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
              example: 'Cocinar el pollo, cortar la lechuga, tomate y mezclar todo.',
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
      },
    },

    paths: {
      '/dishes': {
        post: {
          summary: 'Crear un plato',
          description: 'Crea un nuevo plato con sus ingredientes.',
          tags: ['Dishes'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DishCreateRequest',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Plato creado correctamente',
            },
            400: {
              description: 'Datos inválidos',
            },
            500: {
              description: 'Error interno del servidor',
            },
          },
        },

        get: {
          summary: 'Listar platos',
          description: 'Obtiene el catálogo de platos. Permite filtrar por nombre y tipo de comida.',
          tags: ['Dishes'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'tipo_comida',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                example: 'Almuerzo',
              },
            },
            {
              name: 'nombre',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                example: 'pollo',
              },
            },
          ],
          responses: {
            200: {
              description: 'Lista de platos obtenida correctamente',
            },
            500: {
              description: 'Error interno del servidor',
            },
          },
        },
      },

      '/dishes/{id}': {
        get: {
          summary: 'Obtener plato por ID',
          description: 'Obtiene un plato específico con sus ingredientes y preparación.',
          tags: ['Dishes'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: 'Detalle del plato obtenido correctamente',
            },
            404: {
              description: 'Plato no encontrado',
            },
            500: {
              description: 'Error interno del servidor',
            },
          },
        },

        put: {
          summary: 'Actualizar plato',
          description: 'Actualiza los datos de un plato existente y sus ingredientes.',
          tags: ['Dishes'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer',
                example: 1,
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DishUpdateRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Plato actualizado correctamente',
            },
            404: {
              description: 'Plato no encontrado',
            },
            500: {
              description: 'Error interno del servidor',
            },
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
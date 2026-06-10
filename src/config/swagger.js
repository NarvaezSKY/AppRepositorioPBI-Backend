import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "AppRepositorioPBI Backend API",
      version: "1.0.0",
      description: "Documentacion Swagger del backend para usuarios, modulos y reportes.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error message" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6847f2f8be0f8d7ab98d1234" },
            username: { type: "string", example: "juan.perez" },
            email: { type: "string", example: "juan@empresa.com" },
            role: { type: "string", enum: ["admin", "gfpi"], example: "gfpi" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserCreateRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", maxLength: 50 },
            email: { type: "string", maxLength: 50, format: "email" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["admin", "gfpi"] },
          },
        },
        UserUpdateRequest: {
          type: "object",
          properties: {
            username: { type: "string", maxLength: 50 },
            email: { type: "string", maxLength: 50, format: "email" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["admin", "gfpi"] },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "juan@empresa.com" },
            password: { type: "string", example: "miPassword123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          },
        },
        Module: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6847f2f8be0f8d7ab98d1111" },
            name: { type: "string", example: "Finanzas" },
            description: { type: "string", example: "Modulo de indicadores financieros" },
            visibleToRoles: {
              type: "array",
              items: { type: "string", enum: ["admin", "gfpi"] },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ModuleCreateRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", maxLength: 50 },
            description: { type: "string", maxLength: 300 },
            visibleToRoles: {
              type: "array",
              items: { type: "string", enum: ["admin", "gfpi"] },
            },
          },
        },
        ModuleUpdateRequest: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 50 },
            description: { type: "string", maxLength: 300 },
            visibleToRoles: {
              type: "array",
              items: { type: "string", enum: ["admin", "gfpi"] },
            },
          },
        },
        Report: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6847f2f8be0f8d7ab98d2222" },
            name: { type: "string", example: "Ventas Mensuales" },
            description: { type: "string", example: "Reporte mensual de ventas" },
            url: { type: "string", example: "https://app.powerbi.com/view?r=abc123" },
            module: {
              oneOf: [
                { type: "string", example: "6847f2f8be0f8d7ab98d1111" },
                { $ref: "#/components/schemas/Module" },
              ],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ReportCreateRequest: {
          type: "object",
          required: ["name", "url", "module"],
          properties: {
            name: { type: "string", maxLength: 100 },
            description: { type: "string", maxLength: 300 },
            url: { type: "string", maxLength: 500, example: "https://app.powerbi.com/view?r=abc123" },
            module: { type: "string", description: "ObjectId del modulo", example: "6847f2f8be0f8d7ab98d1111" },
          },
        },
        ReportUpdateRequest: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 100 },
            description: { type: "string", maxLength: 300 },
            url: { type: "string", maxLength: 500, example: "https://app.powerbi.com/view?r=abc123" },
            module: { type: "string", description: "ObjectId del modulo" },
          },
        },
      },
    },
    paths: {
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "Listar usuarios",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            },
          ],
          responses: {
            200: {
              description: "Listado de usuarios",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      users: { type: "array", items: { $ref: "#/components/schemas/User" } },
                      total: { type: "integer" },
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      totalPages: { type: "integer" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Error interno",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Obtener usuario por id",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Usuario encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
            },
            404: { description: "No encontrado" },
            400: {
              description: "Error de validacion",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Actualizar usuario",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserUpdateRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Usuario actualizado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
            },
            404: { description: "No encontrado" },
            400: {
              description: "Error de validacion",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Eliminar usuario",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            204: { description: "Eliminado" },
            404: { description: "No encontrado" },
            400: {
              description: "Error de validacion",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },
      "/api/users/register": {
        post: {
          tags: ["Users"],
          summary: "Registrar usuario",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserCreateRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Usuario creado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
            },
            409: {
              description: "Conflicto (email duplicado)",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            400: {
              description: "Error de validacion",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },
      "/api/users/login": {
        post: {
          tags: ["Users"],
          summary: "Iniciar sesion",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login exitoso",
              content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } },
            },
            401: {
              description: "Credenciales invalidas",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },
      "/api/modules": {
        get: {
          tags: ["Modules"],
          summary: "Listar modulos",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            },
          ],
          responses: {
            200: {
              description: "Listado de modulos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      modules: { type: "array", items: { $ref: "#/components/schemas/Module" } },
                      total: { type: "integer" },
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      totalPages: { type: "integer" },
                    },
                  },
                },
              },
            },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
      },
      "/api/modules/{id}": {
        get: {
          tags: ["Modules"],
          summary: "Obtener modulo por id",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Modulo encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Module" } } },
            },
            404: { description: "No encontrado" },
          },
        },
        put: {
          tags: ["Modules"],
          summary: "Actualizar modulo",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ModuleUpdateRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Modulo actualizado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Module" } } },
            },
            404: { description: "No encontrado" },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
        delete: {
          tags: ["Modules"],
          summary: "Eliminar modulo",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            204: { description: "Eliminado" },
            404: { description: "No encontrado" },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
      },
      "/api/modules/create": {
        post: {
          tags: ["Modules"],
          summary: "Crear modulo",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ModuleCreateRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Modulo creado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Module" } } },
            },
            409: {
              description: "Conflicto por duplicado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
      },
      "/api/reports": {
        get: {
          tags: ["Reports"],
          summary: "Listar reportes",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", minimum: 1, default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            },
          ],
          responses: {
            200: {
              description: "Listado de reportes",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      reports: { type: "array", items: { $ref: "#/components/schemas/Report" } },
                      total: { type: "integer" },
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      totalPages: { type: "integer" },
                    },
                  },
                },
              },
            },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
        post: {
          tags: ["Reports"],
          summary: "Crear reporte",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReportCreateRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Reporte creado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Report" } } },
            },
            404: {
              description: "Modulo no existe",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            409: {
              description: "Nombre de reporte duplicado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
      },
      "/api/reports/{id}": {
        get: {
          tags: ["Reports"],
          summary: "Obtener reporte por id",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Reporte encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Report" } } },
            },
            404: { description: "No encontrado" },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
        put: {
          tags: ["Reports"],
          summary: "Actualizar reporte",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReportUpdateRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Reporte actualizado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Report" } } },
            },
            404: { description: "No encontrado" },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
        delete: {
          tags: ["Reports"],
          summary: "Eliminar reporte",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            204: { description: "Eliminado" },
            404: { description: "No encontrado" },
            401: { description: "No autorizado" },
            403: { description: "Sin permisos" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export { setupSwagger };

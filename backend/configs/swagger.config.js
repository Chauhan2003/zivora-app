import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zivora API",
      version: "1.0.0",
      description: "API documentation for Zivora - Social Media Application",
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Location: {
          type: "object",
          properties: {
            latitude: { type: "number", example: 28.6139 },
            longitude: { type: "number", example: 77.209 },
            city: { type: "string", example: "New Delhi" },
            state: { type: "string", example: "Delhi" },
            country: { type: "string", example: "India" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "Failure" },
            message: { type: "string" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "Failure" },
            errors: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

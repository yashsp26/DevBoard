import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "DevBoard API",
      version: "1.0.0",
      description: "Production-ready REST API for DevBoard.",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
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
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },

        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            role: {
              type: "string",
            },
            isEmailVerified: {
              type: "boolean",
            },
          },
        },

        Profile: {
          type: "object",
          properties: {
            avatar: {
              type: "string",
              nullable: true,
            },
            bio: {
              type: "string",
              nullable: true,
            },
            location: {
              type: "string",
              nullable: true,
            },
            website: {
              type: "string",
              nullable: true,
            },
            github: {
              type: "string",
              nullable: true,
            },
            linkedin: {
              type: "string",
              nullable: true,
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/docs/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

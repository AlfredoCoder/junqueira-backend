// config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jomorais Backend API",
      version: "1.0.0",
      description: "📚 Documentação do Sistema de Gestão Escolar Jomorais",
      contact: {
        name: "Jomorais Team",
        email: "dev@jomorais.com"
      }
    },
    servers: [
      {
        url: "https://jomorais-backend-o5e5.onrender.com",
        description: "Servidor de producao"
      },
	  {
		url: "http://localhost:8000",
		description: "Servidor de desenvolvimento"
	  }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app) => {
  // Rota para documentação Swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Jomorais API Documentation"
  }));

  console.log(`📚 Swagger UI disponível em: ${process.env.BASE_URL || "http://localhost:8000"}/docs`);
};

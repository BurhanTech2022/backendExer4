import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv'
dotenv.config()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Transections',
      version: '1.0.0',
      description: 'API documentation for our task manager backend'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000' : "https://backendexer4-jz29.onrender.com/"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/userRoute.js'] // Where my route files live
};

export const swaggerSpec = swaggerJSDoc(options);
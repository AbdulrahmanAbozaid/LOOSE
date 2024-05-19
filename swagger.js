import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongooseToSwagger from 'mongoose-to-swagger';
import User from './src/';
import Product from './models/product.model';
import Category from './models/category.model';
import Order from './models/order.model';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'API documentation for the E-commerce platform',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
    components: {
      schemas: {
        User: mongooseToSwagger(User),
        Product: mongooseToSwagger(Product),
        Category: mongooseToSwagger(Category),
        Order: mongooseToSwagger(Order),
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/v1/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

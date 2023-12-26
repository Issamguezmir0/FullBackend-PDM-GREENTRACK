import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nom de votre API',
      version: '1.0.0',
      description: 'Description de votre API',
    },
  },
  apis: ['./routes/*.ts'], // spécifiez le chemin vers vos fichiers contenant les commentaires Swagger
};

const specs = swaggerJsdoc(options);

export default specs;

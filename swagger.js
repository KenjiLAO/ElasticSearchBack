const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Pokedle',
        version: '1.0.0',
        description: 'Documentation API pour Pokedle',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Serveur de test',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/pokemon.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
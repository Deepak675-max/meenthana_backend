const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require('../../package.json');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Maanthena APIS Docs",
            version
        },
        servers: [
            {
                url: 'http://localhost:4500'
            }
        ],
        // components: {
        //     securitySchemas: {
        //         bearerAuth: {
        //             type: "http",
        //             schema: "bearer",
        //             bearerFormat: "JWT"
        //         }
        //     }
        // },
        // security: [
        //     {
        //         bearerAuth: [],
        //     }
        // ]
    },
    apis: ['../../routes/auth.route.js']
}

function swaggerDocs(maanthenaBackendApp) {
    const swaggerSpec = swaggerJsdoc(options);
    maanthenaBackendApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    maanthenaBackendApp.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    })
}

module.exports = {
    swaggerDocs
}

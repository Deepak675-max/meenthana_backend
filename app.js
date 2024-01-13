require('dotenv').config();
const express = require('express');
const httpErrors = require("http-errors");
const cors = require("cors");
const path = require("path");
const maanthenaBackendApp = express();
const http = require('http');
const server = http.createServer(maanthenaBackendApp);
maanthenaBackendApp.use(cors({
    origin: "*"
}));

const sequelize = require('./helper/common/init_postgres');
maanthenaBackendApp.use(express.json());
maanthenaBackendApp.use(express.urlencoded({ extended: true }));
maanthenaBackendApp.use(express.static(path.join(__dirname, 'public')));

const version1 = require('./helper/common/route_versions/v1');
maanthenaBackendApp.use('/v1', version1);


maanthenaBackendApp.use(async (req, _res, next) => {
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
maanthenaBackendApp.use((error, req, res, next) => {
    const responseStatus = error.status || 500;
    const responseMessage =
        error.message || `Cannot resolve request [${req.method}] ${req.url}`;
    if (res.headersSent === false) {
        res.status(responseStatus);
        res.send({
            error: {
                status: responseStatus,
                message: responseMessage,
            },
        });
    }
    next();
});

const port = process.env.APP_PORT;

sequelize.sync({ alter: true })
    .then(() => {
        server.listen(port, () => {
            console.log(`server is listening on the port of ${port}`);
        })
    })
    .catch(error => {
        console.log(error);
        process.exit(0);
    })

process.on('SIGINT', () => {
    // Perform cleanup operations here
    console.log('Received SIGINT signal. application terminated successfully.');

    // Exit the application
    process.exit(0);
});





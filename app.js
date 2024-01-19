require('dotenv').config();
const express = require('express');
const httpErrors = require("http-errors");
const cors = require("cors");
const path = require("path");
const maanthenaBackendApp = express();
const http = require('http');
const listEndPoints = require("express-list-endpoints");
const server = http.createServer(maanthenaBackendApp);
maanthenaBackendApp.use(cors({
    origin: "*"
}));

const sequelize = require('./helper/common/init_postgres');
maanthenaBackendApp.use(express.json());
maanthenaBackendApp.use(express.urlencoded({ extended: true }));
maanthenaBackendApp.use(express.static(path.join(__dirname, 'public')));

const { logger } = require('./helper/common/winston');
const { swaggerDocs } = require("./helper/common/swagger");

const { addRoutesIntoDatabase } = require("./helper/common/backend_functions");

swaggerDocs(maanthenaBackendApp);

const version1 = require('./helper/common/route_versions/v1');
maanthenaBackendApp.use('/v1', version1);

const routes = listEndPoints(maanthenaBackendApp);

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

const AccessGroupModel = require("./models/access_gorup/access_group.model");
const AppRoutesModel = require("./models/app_route/app_routes.model");
const ClientPersonalInfoModel = require("./models/client/personal_info.model");
const MerchantPersonalInfoModel = require("./models/merchant/personal_info.model");
const MerchantBusinessInfoModel = require("./models/merchant/business_info.model");
const ForgotPasswordRequests = require("./models/forgetPasswordRequests.model");
const PermissionModel = require("./models/permision/permission.model");

//model associations.
//many-to-many association between AppRoutesModel and AccessGroupModel. 
AppRoutesModel.belongsToMany(AccessGroupModel, { through: PermissionModel, foreignKey: 'appRouteId' });
AccessGroupModel.belongsToMany(AppRoutesModel, { through: PermissionModel, foreignKey: 'accessGroupId' });
PermissionModel.belongsTo(AppRoutesModel, { foreignKey: 'appRouteId' });
PermissionModel.belongsTo(AccessGroupModel, { foreignKey: 'accessGroupId' });

//one-to-many association between ClientPersonalInfoModel and AccessGroupModel.
AccessGroupModel.hasMany(ClientPersonalInfoModel, { foreignKey: "accessGroupId" });
ClientPersonalInfoModel.belongsTo(AccessGroupModel, { foreignKey: "accessGroupId" });

//one-to-many association between MerchantPersonalInfoModel and AccessGroupModel.
AccessGroupModel.hasMany(MerchantPersonalInfoModel, { foreignKey: 'accessGroupId' });
MerchantPersonalInfoModel.belongsTo(AccessGroupModel, { foreignKey: "accessGroupId" });

//one-to-many association between ForgotPasswordRequests and ClientPersonalInfoModel.
ClientPersonalInfoModel.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(ClientPersonalInfoModel, { foreignKey: 'userId' });

//one-to-one association between MerchantPersonalInfoModel and MerchantBusinessInfoModel.
MerchantBusinessInfoModel.belongsTo(MerchantPersonalInfoModel, { foreignKey: 'merchantId' });

//one-to-many association between ForgotPasswordRequests and MerchantPersonalInfoModel.
MerchantPersonalInfoModel.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(MerchantPersonalInfoModel, { foreignKey: 'userId' });

sequelize.sync({ alter: true })
    .then(async () => {
        await addRoutesIntoDatabase(routes);
    })
    .catch(error => {
        logger.error(error);
        console.log(error);
        process.exit(0);
    })

server.listen(port, () => {
    console.log(`server is listening on the port of ${port}`)
    logger.info(`server is listening on the port of ${port}`);
})

process.on('SIGINT', () => {
    // Perform cleanup operations here
    console.log('Received SIGINT signal. application terminated successfully.');
    logger.info('Received SIGINT signal. application terminated successfully.');
    // Exit the application
    process.exit(0);
});





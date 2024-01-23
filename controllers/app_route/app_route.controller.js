const httpErrors = require('http-errors');
const joiAppRoute = require('../../helper/joi/app_route/app_route.joi_validation');
const AppRouteModel = require("../../models/app_route/app_routes.model");
const sequelize = require("../../helper/common/init_postgres");
const { logger } = require("../../helper/common/winston");

const createAppRoute = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const appRouteDetails = await joiAppRoute.createAppRouteSchema.validateAsync(req.body);

        const doesAppRouteExist = await AppRouteModel.findOne({
            where: {
                name: appRouteDetails.path,
                method: appRouteDetails.method,
                isDeleted: false
            }
        });

        if (doesAppRouteExist) throw httpErrors.Conflict(`App Route with path: ${appRouteDetails.path}  and method: ${appRouteDetails.method} already exist`);

        const newAppRoute = await AppRouteModel.create(appRouteDetails, { transaction });

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    appRoute: newAppRoute,
                    message: "App Route created successfully",
                },
            });

        }

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const getAppRoutes = async (req, res, next) => {
    try {
        const appRoutes = await AppRouteModel.findAll({
            where: {
                isDeleted: false
            }
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    appRoutes: appRoutes,
                    message: "App Routes fetched successfully",
                },
            });

        }

    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}


module.exports = {
    createAppRoute,
    getAppRoutes
}
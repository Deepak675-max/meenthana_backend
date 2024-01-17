const AppRouteModel = require("../../models/app_route/app_routes.model");
const httpErrors = require("http-errors");
const { logger } = require("./winston");


const addRoutesIntoDatabase = async (routes) => {
    try {
        await Promise.all(
            routes.map(async (route) => {
                route.methods.map(async (method) => {
                    const appRoute = await AppRouteModel.findOne({
                        where: {
                            path: route.path,
                            method: method,
                            isDeleted: false
                        }
                    });

                    if (!appRoute)
                        await AppRouteModel.create({
                            path: route.path,
                            method: method
                        });
                })
                return;
            })
        )
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: "500", path: __filename });
        throw (error);
    }
}

module.exports = {
    addRoutesIntoDatabase
}
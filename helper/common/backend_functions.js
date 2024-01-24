const AppRouteModel = require("../../models/app_route/app_routes.model");
const httpErrors = require("http-errors");
const { logger } = require("./winston");
const fs = require("fs");

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

const deleteFileFromDirectory = async (files) => {
    try {
        await Promise.all(
            files.map(file => {
                const filePath = file.path;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log("file deleted successfully.");
                } else {
                    throw new Error('File does not exist');
                }
            })
        )
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: "500", path: __filename });
        throw (error);
    }
}

module.exports = {
    addRoutesIntoDatabase,
    deleteFileFromDirectory
}
const ClientPersonalInfoModel = require("../models/client/personal_info.model");
const MerchantPersonalInfoModel = require("../models/merchant/personal_info.model");
const AccessGroupModel = require("../models/access_gorup/access_group.model");
const AppRoutesModel = require("../models/app_route/app_routes.model");
const httpErrors = require("http-errors");

const validatePermission = async (req, res, next) => {
    try {
        const requestPayload = req.payloadData;

        let user;

        if (requestPayload.userType == "CLIENT") {
            user = await ClientPersonalInfoModel.findOne({
                where: {
                    id: requestPayload.userId,
                    isDeleted: false
                }
            });
        }
        else {
            user = await MerchantPersonalInfoModel.findOne({
                where: {
                    id: requestPayload.userId,
                    isDeleted: false
                }
            });
        }

        const accessGroup = await AccessGroupModel.findOne({
            where: {
                id: user.accessGroupId,
                isDeleted: false
            },
            include: [
                {
                    model: AppRoutesModel,
                    attribute: ["path", "method"],
                    through: {
                        where: {
                            isDeleted: false
                        },
                        attribute: []
                    }
                }
            ],
        });

        const permittedRoutes = accessGroup.AppRoutes;

        const requiredRoutes = await Promise.all(
            permittedRoutes.filter(route => {
                if (route.path === req.originalUrl && route.method === req.method) return route;
            })
        )

        if (requiredRoutes.length <= 0) throw httpErrors.Unauthorized("Permission Denied.");

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    validatePermission
}

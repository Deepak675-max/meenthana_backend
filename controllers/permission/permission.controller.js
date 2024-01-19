const httpErrors = require('http-errors');
const joiPermission = require('../../helper/joi/permission/permission.joi_validation');
const AccessGroupModel = require("../../models/access_gorup/access_group.model");
const AppRoutesModel = require("../../models/app_route/app_routes.model");

const sequelize = require("../../helper/common/init_postgres");
const { logger } = require("../../helper/common/winston");
const PermissionModel = require('../../models/permision/permission.model');

const createPermission = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const permissionDetails = await joiPermission.createPermissionSchema.validateAsync(req.body);

        const accessGroup = await AccessGroupModel.findOne({
            where: {
                id: permissionDetails.accessGroupId,
                isDeleted: false
            }
        })

        if (!accessGroup) throw httpErrors.NotFound(`Access Group with id: ${permissionDetails.accessGroupId} does not exist`);

        const appRoutes = await AppRoutesModel.findAll({
            where: {
                id: permissionDetails.appRoutesIds
            }
        });

        if (appRoutes?.length <= 0) throw httpErrors.NotFound(`App Routes with ids: ${permissionDetails.appRoutesIds} do not exist`);

        console.log(accessGroup.constructor.associations);

        await accessGroup.addAppRoutes(permissionDetails.appRoutesIds, { transaction });

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Permission granted successfully",
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

const getPermissions = async (req, res, next) => {
    try {
        const querySchema = await joiPermission.getPermissionsSchema.validateAsync(req.body);
        const query = {
            where: { isDeleted: false },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            order: [], // Order array to hold order configurations
            offset: 0, // Starting offset for pagination
            limit: 10, // Number of records per page
            include: [
                { model: AccessGroupModel, attribute: ["id", "name", "isAdminGroup"] },
                { model: AppRoutesModel, attribute: ["id", "path", "method"] },
            ],
        };

        // Add conditions to the query
        if (querySchema.permissionId) {
            query.where.id = querySchema.permissionId;
        }

        if (querySchema.accessGroupId) {
            query.where.accessGroupId = querySchema.accessGroupId;
        }

        if (querySchema.appRouteId) {
            query.where.appRouteId = querySchema.appRouteId;
        }

        const orderBy = querySchema.metaData?.orderBy || process.env.DEFAULT_ORDER_BY;
        const orderDirection = querySchema.metaData?.orderDirection || process.env.DEFAULT_ORDER_DIRECTION;

        // Add order configurations based on query parameters
        query.order.push([orderBy, orderDirection.toUpperCase()]);

        // Add pagination parameters if provided
        let page = querySchema.metaData?.page || process.env.DEFAULT_PAGE;
        let pageSize = querySchema.metaData?.pageSize || process.env.DEFAULT_PAGE_SIZE;
        query.offset = (page - 1) * pageSize;
        query.limit = pageSize;

        // Execute the query
        const { count: totalRecords, rows: permissions } = await PermissionModel.findAndCountAll(query);

        // Send the response
        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    permissions: permissions,
                    metaData: {
                        orderBy: orderBy,
                        orderDirection: orderDirection,
                        page: page,
                        pageSize: pageSize,
                        totalRecords: totalRecords
                    },
                    message: "Permissions fetched successfully",
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


const updatePermission = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const permissionDetails = await joiPermission.updatePermissionSchema.validateAsync(req.body);

        const permission = await PermissionModel.findOne({
            where: {
                id: permissionDetails.permissionId,
                isDeleted: false
            }
        })

        if (!permission) throw httpErrors.NotFound(`Permission with id: ${permissionDetails.permissionId} does not exist`);

        await PermissionModel.update(permissionDetails,
            {
                where: {
                    id: permissionDetails.permissionId
                }
            },
            {
                transaction
            }
        );


        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Permission updated successfully",
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

const deletePermissions = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const permissionDetails = await joiPermission.deletePermissionSchema.validateAsync(req.body);

        const permissionsToDelete = await PermissionModel.findAll({
            where: {
                id: permissionDetails.permissionIds,
                isDeleted: false
            }
        });

        // Check if all permissions to delete exist
        const missingPermissions = permissionDetails.permissionIds.filter((id) => !permissionsToDelete.find((p) => p.id === id));

        if (missingPermissions.length > 0) {
            throw httpErrors.NotFound(`Permissions with ids ${missingPermissions} do not exist`);
        }

        await PermissionModel.update({ isDeleted: true },
            {
                where: {
                    id: permissionDetails.permissionIds
                }
            },
            {
                transaction
            }
        );

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Permission deleted successfully",
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

module.exports = {
    createPermission,
    getPermissions,
    updatePermission,
    deletePermissions
}
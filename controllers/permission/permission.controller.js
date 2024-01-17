const httpErrors = require('http-errors');
const joiPermission = require('../../helper/joi/permission/permission.joi_validation');
const AccessGroupModel = require("../../models/access_gorup/access_group.model");
const sequelize = require("../../helper/common/init_postgres");
const { logger } = require("../../helper/common/winston");

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

        const appRoutes = await findAll({
            where: {
                id: permissionDetails.appRoutesIds
            }
        });

        if (appRoutes?.length <= 0) throw httpErrors.NotFound(`App Routes with ids: ${permissionDetails.appRoutesIds} do not exist`);

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

const getAccessGroups = async (req, res, next) => {
    try {
        const acessGroups = await AccessGroupModel.findAll({
            where: {
                isDeleted: false
            }
        });

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    accessGroups: acessGroups,
                    message: "Access Groups fetched successfully",
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

const updateAccessGroup = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const accessGroupDetails = await joiAcessGroup.updateAcessGroupSchema.validateAsync(req.body);

        const accessGroup = await AccessGroupModel.findOne({
            where: {
                id: accessGroupDetails.accessGroupId,
                isDeleted: false
            }
        })

        if (!accessGroup) throw httpErrors.NotFound(`Access Group with id: ${accessGroupDetails.accessGroupId} not exist`);

        AccessGroupModel.update(accessGroupDetails,
            {
                where: {
                    id: accessGroup.id
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
                    message: "Access Groups updated successfully",
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

const deleteAccessGroup = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const accessGroupId = parseInt(req.params.id);

        const accessGroup = await AccessGroupModel.findOne({
            where: {
                id: accessGroupId,
                isDeleted: false
            }
        })

        if (!accessGroup) throw httpErrors.NotFound(`Access Group with id: ${accessGroupId} not exist`);

        AccessGroupModel.update(
            {
                isDeleted: true
            },
            {
                where: {
                    id: accessGroup.id
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
                    message: "Access Groups deleted successfully",
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
    getAccessGroups,
    updateAccessGroup,
    deleteAccessGroup
}
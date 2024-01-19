const joi = require('joi');

const createPermissionSchema = joi.object({
    accessGroupId: joi.number().required(),
    appRoutesIds: joi.array().items(joi.number().required()).min(1).required()
});

const getPermissionsSchema = joi.object({
    permissionId: joi.number().optional().default(null),
    accessGroupId: joi.number().optional().default(null),
    appRouteId: joi.number().optional().default(null),
    metaData: joi.object({
        orderBy: joi.string().trim().optional().default(null),
        orderDirection: joi.string().trim().optional().default(null),
        page: joi.number().optional().default(null),
        pageSize: joi.number().optional().default(null),
    }).optional().default(null)
});

const updatePermissionSchema = joi.object({
    permissionId: joi.number().required(),
    accessGroupId: joi.number().optional().default(null),
    appRouteId: joi.number().optional().default(null)
});

const deletePermissionSchema = joi.object({
    permissionIds: joi.array().items(joi.number().required()).min(1).required()
});

module.exports = {
    createPermissionSchema,
    getPermissionsSchema,
    updatePermissionSchema,
    deletePermissionSchema
}


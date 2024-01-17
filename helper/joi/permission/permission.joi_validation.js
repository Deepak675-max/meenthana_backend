const joi = require('joi');

const createPermissionSchema = joi.object({
    accessGroupId: joi.number().required(),
    appRoutesIds: joi.array().items(joi.number().required()).min(1).required()
});

const getPermissionsSchema = joi.object({
    permissionId: joi.number().allow(null).default(null),
    accessGroupId: joi.number().allow(null).default(null),
    appRouteId: joi.number().allow(null).default(null),
});

const updatePermissionSchema = joi.object({
    permissionId: joi.number().required(),
    accessGroupId: joi.string().trim().allow(null).default(null),
    appRoutesIds: joi.array().items(joi.number().required()).min(0).allow(null).default([])
});

module.exports = {
    createPermissionSchema,
    getPermissionsSchema,
    updatePermissionSchema
}


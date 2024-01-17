const joi = require('joi');

const createAppRouteSchema = joi.object({
    path: joi.string().trim().required(),
    method: joi.string().trim().required(),
});

const getAcessGroupSchema = joi.object({
    accessGroupId: joi.number().allow(null).default(null),
    name: joi.string().trim().allow(null).default(null),
    isAdminGroup: joi.boolean().allow(null).default(null),
});

const updateAcessGroupSchema = joi.object({
    accessGroupId: joi.number().required(),
    name: joi.string().trim().allow(null).default(null),
    isAdminGroup: joi.boolean().allow(null).default(null),
});


module.exports = {
    createAppRouteSchema,
    getAcessGroupSchema,
    updateAcessGroupSchema
}


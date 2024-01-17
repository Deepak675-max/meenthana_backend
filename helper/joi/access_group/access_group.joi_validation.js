const joi = require('joi');

const createAcessGroupSchema = joi.object({
    name: joi.string().trim().required(),
    isAdminGroup: joi.boolean().allow(null).default(false),
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
    createAcessGroupSchema,
    getAcessGroupSchema,
    updateAcessGroupSchema
}


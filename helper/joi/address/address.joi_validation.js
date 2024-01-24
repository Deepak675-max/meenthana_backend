const joi = require('joi');

const createAddressSchema = joi.object({
    laneNumberAndStreet: joi.string().trim().required(),
    city: joi.string().trim().required(),
    postalCode: joi.number().integer().trim().required(),
    type: joi.string().trim().valid('Warehouse', 'Shipping', 'Billig').required(),
    isDeleted: joi.boolean().optional().default(false)
});

const getAddressSchema = joi.object({
    addressId: joi.number().allow(null).default(null)
});

const updateAddressSchema = joi.object({
    addressId: joi.number().required(),
    laneNumberAndStreet: joi.string().trim().optional(),
    city: joi.string().trim().optional(),
    postalCode: joi.number().integer().trim().optional(),
    type: joi.string().trim().valid('Warehouse', 'Shipping', 'Billig').optional()
});

const deleteAddressSchema = joi.object({
    addressId: joi.number().allow(null).default(null)
});


module.exports = {
    createAddressSchema,
    getAddressSchema,
    updateAddressSchema,
    deleteAddressSchema
}


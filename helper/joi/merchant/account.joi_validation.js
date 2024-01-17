const joi = require('joi');

const updatePersionalDetails = joi.object({
    firstName: joi.string().trim().allow(null).default(null),
    lastName: joi.string().trim().allow(null).default(null),
    email: joi.string().trim().email().allow(null).default(null),
    phoneNumber: joi.string().length(10).trim().allow(null).default(null),
    password: joi.string().trim().allow(null).default(null),
})

const loginUserSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})

module.exports = {
    updatePersionalDetails,
    loginUserSchema
}


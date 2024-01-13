const joi = require('joi');

const signupUserSchema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    phoneNumber: joi.string().trim().required(),
    password: joi.string().trim().required(),
    businessName: joi.string().trim().required(),
    businessAddress: joi.string().trim().required(),
    vatNumber: joi.string().trim().required(),
    fieldOfActivity: joi.string().trim().required(),
    siretNumber: joi.number().required(),
    businessDescription: joi.string().trim().required()
})

const loginUserSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})

module.exports = {
    signupUserSchema,
    loginUserSchema
}


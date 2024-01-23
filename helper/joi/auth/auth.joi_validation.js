const joi = require('joi');

const merchantRegistrationDetailsSchema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    phoneNumber: joi.string().length(10).trim().required(),
    termAndCondition: joi.boolean().allow(null).default(false),
    businessName: joi.string().trim().required(),
    businessEmailAddress: joi.string().trim().required(),
    vatNumber: joi.number().required(),
    fieldOfActivity: joi.string().trim().required(),
    siretNumber: joi.number().required(),
    businessDescription: joi.string().trim().required(),
});


const ClientRegistrationDetailsSchema = joi.object({
    firstName: joi.string().trim().required(),
    lastName: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    phoneNumber: joi.string().length(10).trim().required(),
    password: joi.string().trim().required(),
    dateOfBirth: joi.date().required(),
    gender: joi.string().trim().required(),
    termAndCondition: joi.boolean().allow(null).default(false),
});

const loginUserSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})

module.exports = {
    merchantRegistrationDetailsSchema,
    ClientRegistrationDetailsSchema,
    loginUserSchema
}


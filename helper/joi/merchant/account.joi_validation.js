const joi = require('joi');

const updatePersionalDetails = joi.object({
    firstName: joi.string().trim().allow(null).default(null),
    lastName: joi.string().trim().allow(null).default(null),
    email: joi.string().trim().email().allow(null).default(null),
    phoneNumber: joi.string().length(10).trim().allow(null).default(null),
    password: joi.string().trim().allow(null).default(null),
});

const getMerchantPersonalDetailsSchema = joi.object({
    merchantId: joi.number().required()
})


const ConfigureMaathenaStroeSchema = joi.object({
    merchantId: joi.number().required(),
    businessName: joi.string().trim().required(),
    businessEmailAddress: joi.string().email().required(),
    phoneNumber: joi.string().length(10).trim().required(),
    dateOfCreation: joi.date().required(),
    workWithStorageWareHouse: joi.boolean().required(),
    wareHouseAddesses: joi.when('workWithStorageWareHouse', {
        is: true,
        then: joi.array().items(joi.object({
            laneNumberAndStreet: joi.string().required(),
            postalCode: joi.string().required(),
            city: joi.string().required()
        })).min(1).required(),
        otherwise: joi.forbidden(), // Not allowed when workWithStorageWareHouse is false
    }),
    deliveredAbroad: joi.boolean().required(),
    isfranchise: joi.boolean().required(),
    annualTurnOver: joi.number().required(),
    openingHours: joi.string().required(),
    labels: joi.array().items(joi.string().required()).min(1).required(),
})

const setMerchantPasswordSchema = joi.object({
    merchantId: joi.number().required(),
    password: joi.string().min(8).trim().required(),
    confirmPassword: joi.string().min(8).trim().required(),
})

module.exports = {
    updatePersionalDetails,
    ConfigureMaathenaStroeSchema,
    getMerchantPersonalDetailsSchema,
    setMerchantPasswordSchema
}


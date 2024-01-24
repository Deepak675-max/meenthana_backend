const joi = require('joi');
const { fileSchema } = require("../file/file.joi_validation");

// const createProductSchema = joi.object({
//     productName: joi.string().optional().default(null),
//     reference: joi.string().required(),
//     brand: joi.string().required(),
//     resume: joi.string().required(),
//     description: joi.string().required(),
//     salesPriceIncludingTax: joi.number().integer().required(),
//     promotion: joi.string().required(),
//     quantity: joi.number().integer().required(),
//     category: joi.string().required(),
//     dimensions: joi.object({
//         length: joi.number().integer().required(),
//         width: joi.number().integer().required(),
//         height: joi.number().integer().required(),
//     }).required(),
//     weight: joi.number().required(),
//     label: joi.string().required(),
//     variants: joi.object({
//         colors: joi.array().items(joi.string().required()).min(1).required(),
//         sizes: joi.array().items(joi.string().required()).min(1).required(),
//     }).required(),
//     isDeleted: joi.boolean().default(false),
// });


const createProductSchema = joi.object({
    productName: joi.string().trim().required(),
    reference: joi.string().trim().required(),
    brand: joi.string().trim().required(),
    resume: joi.string().trim().required(),
    description: joi.string().trim().required(),
    salesPriceIncludingTax: joi.number().integer().required(),
    promotion: joi.string().trim().required(),
    quantity: joi.number().integer().required(),
    category: joi.string().trim().required(),
    dimensions: joi.string().trim().required(),
    weight: joi.number().required(),
    label: joi.string().trim().required(),
    variants: joi.string().trim().required(),
    isDeleted: joi.boolean().optional().default(false),
});

const createProductFileSchema = joi.object({
    productImages: joi.array().items(fileSchema).required(),
    thumbnailImage: joi.array().items(fileSchema).required(),
})

const getProductsSchema = joi.object({
    productId: joi.number().integer().optional().default(null),
    brand: joi.string().trim().optional().default(null),
    category: joi.string().trim().optional().default(null),
    search: joi.string().trim().optional().default(null),
    metaData: joi.object({
        orderBy: joi.string().trim().optional().default(null),
        orderDirection: joi.string().trim().optional().default(null),
        page: joi.number().optional().default(null),
        pageSize: joi.number().optional().default(null),
    }).optional().default(null)
})

const updateProductSchema = joi.object({
    productId: joi.number().integer().optional().default(null),
    productName: joi.string().trim().optional().default(null),
    reference: joi.string().trim().optional().default(null),
    brand: joi.string().trim().optional().default(null),
    resume: joi.string().trim().optional().default(null),
    description: joi.string().trim().optional().default(null),
    salesPriceIncludingTax: joi.number().integer().optional().default(null),
    promotion: joi.string().trim().optional().default(null),
    quantity: joi.number().integer().optional().default(null),
    category: joi.string().trim().optional().default(null),
    dimensions: joi.string().trim().optional().default(null),
    weight: joi.number().optional().default(null),
    label: joi.string().trim().optional().default(null),
    variants: joi.string().trim().optional().default(null),
    isDeleted: joi.boolean().optional().default(false),
})

const updateProductFileSchema = joi.object({
    productImages: joi.array().items(fileSchema).optional().default(null),
    thumbnailImage: joi.array().items(fileSchema).optional().default(null),
})

const deleteProductsSchema = joi.object({
    productsIds: joi.array().items(joi.number().integer()).min(1).required()
})

module.exports = {
    createProductSchema,
    createProductFileSchema,
    getProductsSchema,
    updateProductSchema,
    updateProductFileSchema,
    deleteProductsSchema
};

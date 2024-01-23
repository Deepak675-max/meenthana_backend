const MerchantPersonalInfoModel = require("../../models/merchant/personal_info.model");
const httpErrors = require('http-errors');
const joiProduct = require('../../helper/joi/product/product.joi_validation');
const sequelize = require("../../helper/common/init_postgres");
const ProductModel = require("../../models/product/product.model");
const { logger } = require("../../helper/common/winston");
const FileModel = require("../../models/file/file.model");
const { Op } = require('sequelize');


const createProduct = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const productDetails = await joiProduct.createProductSchema.validateAsync(req.body);

        const filesDetails = await joiProduct.createProductFileSchema.validateAsync(req.files);

        const productPhotosFiles = await FileModel.bulkCreate(filesDetails.productImages, { transaction });
        const prodcutsThumbnailPhotofile = await FileModel.create(filesDetails.thumbnailImage[0], { transaction });

        const newProduct = await ProductModel.create({
            merchantId: req.payloadData.userId,
            productDetails
        }, { transaction });

        await newProduct.addFiles(productPhotosFiles, { transaction });
        await newProduct.addFiles(prodcutsThumbnailPhotofile, { transaction });

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    productDetails: newProduct,
                    message: "Product is created successfully",
                },
            });
        }

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const getProducts = async (req, res, next) => {
    try {
        const querySchema = await joiProduct.getProductsSchema.validateAsync(req.body);
        console.log(querySchema);
        const query = {
            where: {},
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            order: [], // Order array to hold order configurations
            offset: 0, // Starting offset for pagination
            limit: 10, // Number of records per page,
        };

        console.log(querySchema);

        if (querySchema.search) {
            query.where = {
                [Op.or]: [
                    { productName: { [Op.like]: `%${querySchema.search}%` } },
                    { brand: { [Op.like]: `%${querySchema.search}%` } },
                    { category: { [Op.like]: `%${querySchema.search}%` } },
                    { description: { [Op.like]: `%${querySchema.search}%` } },
                ],
            };
        }
        query.where.isDeleted = false
        // Add conditions to the query
        if (querySchema.productId) {
            query.where.id = querySchema.productId;
        }

        if (querySchema.brand) {
            query.where.brand = querySchema.brand;
        }

        if (querySchema.category) {
            query.where.category = querySchema.category;
        }

        const orderBy = querySchema.metaData?.orderBy || process.env.DEFAULT_ORDER_BY;
        const orderDirection = querySchema.metaData?.orderDirection || process.env.DEFAULT_ORDER_DIRECTION;

        // Add order configurations based on query parameters
        query.order.push([orderBy, orderDirection.toUpperCase()]);

        // Add pagination parameters if provided
        let page = querySchema.metaData?.page || process.env.DEFAULT_PAGE;
        let pageSize = querySchema.metaData?.pageSize || process.env.DEFAULT_PAGE_SIZE;
        query.offset = (page - 1) * pageSize;
        query.limit = pageSize;

        // Execute the query
        const { count: totalRecords, rows: products } = await ProductModel.findAndCountAll(query);
        console.log(products);
        // Send the response
        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    products: products,
                    metaData: {
                        orderBy: orderBy,
                        orderDirection: orderDirection,
                        page: page,
                        pageSize: pageSize,
                        totalRecords: totalRecords
                    },
                    message: "products fetched successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

module.exports = {
    createProduct,
    getProducts
}
const httpErrors = require('http-errors');
const joiProduct = require('../../helper/joi/product/product.joi_validation');
const sequelize = require("../../helper/common/init_postgres");
const ProductModel = require("../../models/product/product.model");
const { logger } = require("../../helper/common/winston");
const FileModel = require("../../models/file/file.model");
const { Op } = require('sequelize');
const { deleteFileFromDirectory } = require("../../helper/common/backend_functions");

const createProduct = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const productDetails = await joiProduct.createProductSchema.validateAsync(req.body);

        const filesDetails = await joiProduct.createProductFileSchema.validateAsync(req.files);

        const productPhotosFiles = await FileModel.bulkCreate(filesDetails.productImages, { transaction });

        const productThumbnailPhotofile = await FileModel.create(filesDetails.thumbnailImage[0], { transaction });

        const newProduct = await ProductModel.create(productDetails, { transaction });

        await newProduct.addFiles(productPhotosFiles, { transaction });
        await newProduct.addFiles(productThumbnailPhotofile, { transaction });

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
            res.status(200).send({
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

const updateProduct = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const productDetails = await joiProduct.updateProductSchema.validateAsync(req.body);

        const filesDetails = await joiProduct.updateProductFileSchema.validateAsync(req.files);

        const productPhotosFiles = await FileModel.bulkCreate(filesDetails.productImages, { transaction });

        const productThumbnailPhotofile = await FileModel.create(filesDetails.thumbnailImage[0], { transaction });

        const product = await ProductModel.findOne({
            where: {
                id: productDetails.productId,
                isDeleted: false
            }
        });

        if (!product) throw httpErrors.NotFound(`Product with id: ${productDetails.productId} does not exist`);

        await ProductModel.update(productDetails, {
            where: {
                id: productDetails.productId,
                isDeleted: false
            }
        }, { transaction })

        if (filesDetails.productImages?.length > 0) {
            const existingFiles = await FileModel.findAll({
                where: {
                    productId: product.id,
                    fieldname: "productImages",
                    isDeleted: false
                }
            })
            await deleteFileFromDirectory(existingFiles);
            await FileModel.update({ isDeleted: true }, {
                where: {
                    productId: product.id,
                    fieldname: "productImages",
                    isDeleted: false
                }
            });
            await product.addFiles(productPhotosFiles, { transaction });

        }
        if (filesDetails.thumbnailImage?.length > 0) {
            const existingFiles = await FileModel.findAll({
                where: {
                    productId: product.id,
                    fieldname: "thumbnailImage",
                    isDeleted: false
                }
            })
            await deleteFileFromDirectory(existingFiles);
            await FileModel.update({ isDeleted: true }, {
                where: {
                    productId: product.id,
                    fieldname: "thumbnailImage",
                    isDeleted: false
                }
            })
            await product.addFiles(productThumbnailPhotofile, { transaction });
        }

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Product is updated successfully",
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

const deleteProducts = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const productDetails = await joiProduct.deleteProductsSchema.validateAsync(req.body);

        const productsToDelete = await ProductModel.findAll({
            where: {
                id: productDetails.productsIds,
                isDeleted: false
            }
        })
        const missingProducts = productDetails.productsIds.filter((id) => !productsToDelete.find((p) => p.id === id));

        if (missingProducts.length > 0) {
            throw httpErrors.NotFound(`Products with ids ${missingProducts} do not exist`);
        }

        await ProductModel.update({ isDeleted: true },
            {
                where: {
                    id: productDetails.productsIds,
                    isDeleted: false
                }
            },
            {
                transaction
            }
        );

        const existingFiles = await FileModel.findAll({
            where: {
                productId: productDetails.productsIds,
                isDeleted: false
            }
        })
        await deleteFileFromDirectory(existingFiles);
        await FileModel.update({ isDeleted: true }, {
            where: {
                productId: productDetails.productsIds,
                isDeleted: false
            }
        })

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Products deleted successfully",
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

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProducts
}
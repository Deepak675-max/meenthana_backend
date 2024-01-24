const httpErrors = require('http-errors');
const joiAddress = require('../../helper/joi/address/address.joi_validation');
const AddressModel = require("../../models//address/address.model");
const sequelize = require("../../helper/common/init_postgres");
const { logger } = require("../../helper/common/winston");

const createAddress = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const addressDetails = await joiAddress.createAddressSchema.validateAsync(req.body);

        const newAddress = await AddressModel.create(addressDetails, { transaction });

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    addressDetails: newAddress,
                    message: "Access Group created successfully",
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

const getAddresses = async (req, res, next) => {
    try {
        const querySchema = await joiAddress.getAddressSchema.validateAsync(req.body);

        const query = {
            where: {
                isDeleted: false,
            }
        }

        if (querySchema.addressId) {
            query.where.id = querySchema.addressId
        }

        if (querySchema.merchantBusinessId) {
            query.where.merchantBusinessId = querySchema.merchantBusinessId
        }

        if (querySchema.clientId) {
            query.where.clientId = querySchema.clientId
        }

        if (querySchema.type) {
            query.where.type = querySchema.type
        }

        const addresses = await AddressModel.findAll(query);

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    addtress: addresses,
                    message: "Addresses fetched successfully",
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

const updateAddress = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const addressDetails = await joiAddress.updateAddressSchema.validateAsync(req.body);

        const address = await AddressModel.findOne({
            where: {
                id: addressDetails.addressId,
                isDeleted: false
            }
        })

        if (!address) throw httpErrors.NotFound(`Address with id: ${addressDetails.accessGroupId} not exist`);

        AddressModel.update(addressDetails,
            {
                where: {
                    id: address.id
                }
            },
            {
                transaction
            }
        );

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Address updated successfully",
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

const deleteAddress = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const addressDetails = await joiAddress.deleteAddressSchema.validateAsync(req.body);

        const address = await AddressModel.findOne({
            where: {
                id: addressDetails.addressId,
                isDeleted: false
            }
        })

        if (!address) throw httpErrors.NotFound(`Address with id: ${addressDetails.accessGroupId} not exist`);

        AddressModel.update(
            {
                isDeleted: true
            },
            {
                where: {
                    id: address.id
                }
            },
            {
                transaction
            }
        );

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Address deleted successfully",
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
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress
}
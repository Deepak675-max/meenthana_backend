const MerchantPersonalInfoModel = require("../../models/merchant/personal_info.model");
const httpErrors = require('http-errors');
const joiAccount = require('../../helper/joi/merchant/account.joi_validation');
const joiFile = require('../../helper/joi/file/file.joi_validation');
const sequelize = require("../../helper/common/init_postgres");
const MerchantBusinessInfoModel = require("../../models/merchant/business_info.model");
const { logger } = require("../../helper/common/winston");
const FileModel = require("../../models/file/file.model");
const bcrypt = require('bcrypt');
const { sendEmail } = require("../../helper/sevice/nodemailer.sevice");

const updateMerchantPersionalDetails = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const merchantPersonalDetails = await joiAccount.updatePersionalDetails.validateAsync(req.body);

        const user = await MerchantPersonalInfoModel.findOne({
            where: {
                id: accountDetails.userId,
                isDeleted: false,
            }
        });

        if (!user) throw httpErrors.NotFound(`User with id: ${accountDetails.userId} does not exist`);


        await MerchantPersonalInfoModel.update(merchantPersonalDetails, {
            where: {
                id: merchantPersonalDetails.userId
            }
        })

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const setMerchantPassword = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const merchantDetails = await joiAccount.setMerchantPasswordSchema.validateAsync(req.body);
        if (merchantDetails.password != merchantDetails.confirmPassword) {
            throw httpErrors.UnprocessableEntity("confirm password does not match with password");
        }

        const merchant = await MerchantPersonalInfoModel.findOne({
            where: {
                id: merchantDetails.merchantId,
                isDeleted: false
            }
        })

        if (!merchant) throw httpErrors.NotFound(`Merchant with id: ${merchantDetails.merchantId} does not exist`);

        const password = merchantDetails.password;

        merchantDetails.password = await bcrypt.hash(merchantDetails.password, 10);

        await MerchantPersonalInfoModel.update(merchantDetails, {
            where: {
                id: merchant.id,
                isDeleted: false
            }
        }, { transaction })

        await transaction.commit();

        sendEmail({
            recipient: merchant.email,
            password: password
        })

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Maathena password setted successfully",
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

const ConfigureMaathenaStroeSchema = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const merchantMaathenaStroeDetails = await joiAccount.ConfigureMaathenaStroeSchema.validateAsync(req.body);

        const fileDetails = await joiFile.fileSchema.validateAsync(req.file);

        const merchant = await MerchantPersonalInfoModel.findOne({
            where: {
                id: merchantMaathenaStroeDetails.merchantId,
                isDeleted: false,
            }
        });

        if (!merchant) throw httpErrors.NotFound(`Merchant with id: ${merchantMaathenaStroeDetails.merchantId} does not exist`);

        const merchantBusinessDetails = await MerchantBusinessInfoModel.findOne({
            where: {
                merchantId: merchantMaathenaStroeDetails.merchantId,
                isDeleted: false,
            }
        });

        if (!merchantBusinessDetails) throw httpErrors.NotFound(`Merchant business details with merchatId: ${merchantMaathenaStroeDetails.merchantId} does not exist`);

        await MerchantBusinessInfoModel.update(merchantMaathenaStroeDetails, {
            where: {
                merchantId: merchant.id
            }
        }, { transaction });

        const existingFile = await FileModel.findOne({
            where: {
                merchantBusinessId: merchantBusinessDetails.id,
                isDeleted: false
            }
        });

        if (existingFile) {

            await FileModel.update(fileDetails,
                {
                    where: {
                        merchantBusinessId: merchantBusinessDetails.id,
                    }
                },
                { transaction }
            );
        } else {
            await FileModel.create({
                merchantBusinessId: merchantBusinessDetails.id,
                ...fileDetails
            }, { transaction });
        }

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    message: "Maathena store configured successfully",
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

const getMerchantPersonalDetails = async (req, res, next) => {
    try {
        const querySchema = await joiAccount.getMerchantPersonalDetailsSchema.validateAsync(req.body);

        const merchant = await MerchantPersonalInfoModel.findOne({
            where: {
                id: querySchema.merchantId,
                isDeleted: false
            }
        });

        if (!merchant) throw httpErrors.NotFound(`Merchant with id: ${querySchema.merchantId} does not exist`);

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    merchantDetails: merchant,
                    message: "Merchant fetched successfully",
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
    updateMerchantPersionalDetails,
    ConfigureMaathenaStroeSchema,
    getMerchantPersonalDetails,
    setMerchantPassword
}
const MerchantPersonalInfoModel = require('../../models/merchant/personal_info.model');
const ClientPersonalInfoModel = require('../../models/client/personal_info.model');
const MerchantBusinessInfoModel = require('../../models/merchant/business_info.model');
const httpErrors = require('http-errors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const jwtModule = require('../../middlewares/auth.middleware')
const joiUser = require('../../helper/joi/auth.joi_validation');
const { sendForgotPasswordEmail } = require('../../helper/sevice/nodemailer.sevice');
const ForgotPasswordRequests = require('../../models/forgetPasswordRequests.model');
const sequelize = require("../../helper/common/init_postgres");

const { logger } = require("../../helper/common/winston");


const registerMerchant = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const merchantDetails = await joiUser.merchantRegistrationDetailsSchema.validateAsync(req.body);

        const doesMerchantExist = await MerchantPersonalInfoModel.findOne({
            where: {
                email: merchantDetails.email,
                phoneNumber: merchantDetails.phoneNumber,
                isDeleted: false
            }
        });

        if (doesMerchantExist)
            throw httpErrors.Conflict(`Merchant with email: ${merchantDetails.email} and phone number: ${merchantDetails.phoneNumber} already exist`);


        const newMerchant = new MerchantPersonalInfoModel({
            firstName: merchantDetails.firstName,
            lastName: merchantDetails.lastName,
            email: merchantDetails.email,
            phoneNumber: merchantDetails.phoneNumber,
            termAndCondition: merchantDetails.termAndCondition
        }, { transaction });

        const merchant = await newMerchant.save({ transaction });

        const newMerchantBusiness = await MerchantBusinessInfoModel.create({
            merchantId: merchant.id,
            businessName: merchantDetails.businessName,
            businessAddress: merchantDetails.businessAddress,
            dateOfCreation: merchantDetails.dateOfCreation,
            vatNumber: merchantDetails.vatNumber,
            fieldOfActivity: merchantDetails.fieldOfActivity,
            siretNumber: merchantDetails.siretNumber,
            businessDescription: merchantDetails.businessDescription
        }, { transaction });

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    merchantPersonalDetails: merchant,
                    merchantBusinessDetails: newMerchantBusiness,
                    message: "Merchant SignUp successfully",
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

const registerClient = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const clientDetails = await joiUser.ClientRegistrationDetailsSchema.validateAsync(req.body);

        const doesClientExist = await ClientPersonalInfoModel.findOne({
            where: {
                email: clientDetails.email,
                phoneNumber: clientDetails.phoneNumber,
                isDeleted: false
            }
        });

        if (doesClientExist)
            throw httpErrors.Conflict(`Client with email: ${clientDetails.email} and phone number: ${clientDetails.phoneNumber} already exist`);

        clientDetails.password = await bcrypt.hash(clientDetails.password, 10);

        const newClient = new ClientPersonalInfoModel(clientDetails, { transaction });

        const client = await newClient.save({ transaction });

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    client: client,
                    message: "Client SignUp successfully",
                },
            });
        }

    } catch (error) {
        await transaction.rollback();
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const loginMerchant = async (req, res, next) => {
    try {
        const userDetails = await joiUser.loginUserSchema.validateAsync(req.body);

        const merchant = await MerchantPersonalInfoModel.findOne({
            where: {
                email: userDetails.email,
                isDeleted: false
            }
        })
        if (!merchant)
            throw httpErrors.Unauthorized('invalid credentials');

        const isPasswordMatch = await bcrypt.compare(userDetails.password, merchant.password);

        if (!isPasswordMatch)
            throw httpErrors.Unauthorized('invalid credentials.');

        const jwtAccessToken = await jwtModule.signAccessToken({
            userId: merchant.id,
            firstName: merchant.firstName,
            lastName: merchant.lastName,
            email: merchant.email,
            type: "MERCHANT"
        });

        const jwtRefreshToken = await jwtModule.signRefreshToken({
            userId: merchant.id,
            firstName: merchant.firstName,
            lastName: merchant.lastName,
            email: merchant.email,
            type: "MERCHANT"
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    merchant: {
                        id: merchant.id,
                        firstName: merchant.firstName,
                        lastName: merchant.lastName,
                        email: merchant.email
                    },
                    accessToken: jwtAccessToken,
                    refreshToken: jwtRefreshToken,
                    message: "Merchant login successfully",
                },
            });
        }

    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const loginClient = async (req, res, next) => {
    try {
        const userDetails = await joiUser.loginUserSchema.validateAsync(req.body);

        const client = await ClientPersonalInfoModel.findOne({
            where: {
                email: userDetails.email,
                isDeleted: false
            }
        })
        if (!client)
            throw httpErrors.Unauthorized('invalid credentials');

        const isPasswordMatch = await bcrypt.compare(userDetails.password, client.password);

        if (!isPasswordMatch)
            throw httpErrors.Unauthorized('invalid credentials.');

        const jwtAccessToken = await jwtModule.signAccessToken({
            userId: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            type: "CLIENT"
        });

        const jwtRefreshToken = await jwtModule.signRefreshToken({
            userId: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            type: "CLIENT"
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    client: {
                        id: client.id,
                        firstName: client.firstName,
                        lastName: client.lastName,
                        email: client.email,
                    },
                    accessToken: jwtAccessToken,
                    refreshToken: jwtRefreshToken,
                    message: "Client login successfully",
                },
            });
        }

    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        console.log(error);
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const refreshUser = async (req, res, next) => {
    try {
        const user = req.payloadData;

        const jwtAccessToken = await jwtModule.signAccessToken({
            userId: user.userId,
            email: user.email
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    accessToken: jwtAccessToken,
                    message: "User refereshed successfully",
                },
            });
        }

    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}

const getUserFromToken = async (req, res, next) => {
    try {
        const userDetails = {
            userId: req.payloadData.userId,
            email: req.payloadData.email,
        };
        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    user: userDetails,
                    message: "User fetched successfully",
                },
            });
        }
    } catch (error) {
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status ? error.status : 500, path: __filename });
        next(error);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        // Check if Payload contains appAgentId
        if (!req.payloadData.userId) {
            throw httpErrors.UnprocessableEntity(
                `JWT Refresh Token error : Missing Payload Data`
            );
        }
        // Delete Refresh Token and Access Token from Redis DB
        await jwtModule
            .removeToken({
                userId: req.payloadData.userId,
            })
            .catch((error) => {
                throw httpErrors.InternalServerError(
                    `JWT Access Token error : ${error.message}`
                );
            });

        res.status(200).send({
            error: false,
            data: {
                message: "User logged out successfully.",
            },
        });
    } catch (error) {
        next(error);
    }
}

const forceLogoutUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        await jwtModule
            .removeToken({
                userId: userId,
            })
            .catch((error) => {
                throw httpErrors.InternalServerError(
                    `JWT Access Token error : ${error.message}`
                );
            });

        res.status(200).send({
            error: false,
            data: {
                message: "User force logged out successfully.",
            },
        });
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: error.status ? error.status : 500, path: __filename });
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const user = await UserPersonalInfoModel.findOne({
            where: {
                email: req.body.email,
            }
        })
        const data = {
            id: uuidv4(),
            userId: user.id,
            isActive: true,
        }
        await ForgotPasswordRequests.create(data);
        const emailConfig = {
            recipient: req.body.email,
            recoveryToken: data.id
        }
        const emailRes = await sendForgotPasswordEmail(emailConfig);
        if (!emailRes.messageId) {
            throw httpErrors[500]('Something went wrong while sending email');
        }
        res.status(200).send({
            error: false,
            data: {
                emailDetails: emailRes,
                message: "forgot password link send to your email successfully.",
            },
        });
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: error.status ? error.status : 500, path: __filename });
        next(error);
    }
}

const sendResetPasswordForm = async (req, res, next) => {
    try {
        const id = req.params.id;

        const forgotPasswordRequest = await ForgotPasswordRequests.findOne({
            where: {
                id: id,
                isActive: true
            }
        })
        if (!forgotPasswordRequest) {
            throw httpErrors.UnprocessableEntity('link is no longer active');
        }
        const filePath = path.join(__dirname, '../public/resetpassword.html')
        let fileData = fs.readFileSync(filePath, 'utf8');
        fileData = fileData.replace('{{resetToken}}', id)
        res.send(fileData);
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: error.status ? error.status : 500, path: __filename });
        next(error);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const password = req.body.password;
        const conformPassword = req.body.confirmPassword;
        if (password != conformPassword) {
            res.send('confirm password doed not match.')
        }
        const resetToken = req.params.resetToken;
        const requestDetails = await ForgotPasswordRequests.findOne({
            where: {
                id: resetToken
            }
        })
        const hashPassword = await bcrypt.hash(password, 10);

        const result = await UserPersonalInfoModel.update({ password: hashPassword }, {
            where: {
                id: requestDetails.userId
            }
        })
        if (result == 0) {
            throw httpErrors.UnprocessableEntity('something went wrong while updating password');
        }
        res.send('Password updated successfully.')
    } catch (error) {
        console.log(error);
        logger.error(error.message, { status: error.status ? error.status : 500, path: __filename });
        next(error);
    }
}

module.exports = {
    registerMerchant,
    registerClient,
    loginClient,
    loginMerchant,
    getUserFromToken,
    logoutUser,
    refreshUser,
    sendResetPasswordForm,
    forgotPassword,
    updatePassword,
    forceLogoutUser
}

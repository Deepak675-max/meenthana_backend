const UserPersonalInfoModel = require('../models/user/user_personal_info.model');
const UserBusinessInfoModel = require('../models/user/user_business_info.model');
const httpErrors = require('http-errors');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const jwtModule = require('../middlewares/auth.middleware')
const joiUser = require('../helper/joi/auth.joi_validation');
const { sendForgotPasswordEmail } = require('../helper/sevice/nodemailer.sevice');
const ForgotPasswordRequests = require('../models/forgetPasswordRequests.model');
const { isUtf8 } = require('buffer');
const { userInfo } = require('os');
const sequelize = require("../helper/common/init_postgres");

const signupUser = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const userDetails = await joiUser.signupUserSchema.validateAsync(req.body);

        const doesUserExist = await UserPersonalInfoModel.findOne({
            where: {
                email: userDetails.email
            }
        })

        if (doesUserExist)
            throw httpErrors.Conflict(`User with email: ${userDetails.email} already exist`);

        userDetails.password = await bcrypt.hash(userDetails.password, 10);

        const newUser = new UserPersonalInfoModel({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber,
            password: userDetails.password
        }, { transaction });

        const user = await newUser.save({ transaction });

        const userBusinessDetails = await UserBusinessInfoModel.create({
            userId: user.id,
            businessName: userDetails.businessName,
            businessAddress: userDetails.businessAddress,
            vatNumber: userDetails.vatNumber,
            fieldOfActivity: userDetails.fieldOfActivity,
            siretNumber: userDetails.siretNumber,
            businessDescription: userDetails.businessDescription
        }, { transaction })

        await transaction.commit();

        if (res.headersSent === false) {
            res.status(201).send({
                error: false,
                data: {
                    userPersionalDetails: user,
                    userBusinessDetails: userBusinessDetails,
                    message: "User SignUp successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        await transaction.rollback();
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const userDetails = await joiUser.loginUserSchema.validateAsync(req.body);

        const doesUserExist = await UserPersonalInfoModel.findOne({
            where: {
                email: userDetails.email,
            }
        })
        if (!doesUserExist)
            throw httpErrors.Unauthorized('invalid credentials');

        const isPasswordMatch = await bcrypt.compare(userDetails.password, doesUserExist.password);

        if (!isPasswordMatch)
            throw httpErrors.Unauthorized('invalid credentials.');

        const jwtAccessToken = await jwtModule.signAccessToken({
            userId: doesUserExist.id,
            email: doesUserExist.email
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    user: {
                        userId: doesUserExist.id,
                        userName: doesUserExist.userName,
                        email: doesUserExist.email
                    },
                    token: jwtAccessToken,
                    message: "User login successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const getUserFromToken = async (req, res, next) => {
    try {
        const userDetails = {
            userId: req.user.id,
            userName: req.user.userName,
            email: req.user.email,
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
        next(error);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        // Check if Payload contains appAgentId
        if (!req.user.id) {
            throw httpErrors.UnprocessableEntity(
                `JWT Refresh Token error : Missing Payload Data`
            );
        }
        // Delete Refresh Token from Redis DB
        await jwtModule
            .removeToken({
                userId: req.user.id,
            })
            .catch((error) => {
                throw httpErrors.InternalServerError(
                    `JWT Access Token error : ${error.message}`
                );
            });

        res.status(200).send({
            error: false,
            data: {
                message: "Agent logged out successfully.",
            },
        });
    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({
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

        const result = await User.update({ password: hashPassword }, {
            where: {
                id: requestDetails.userId
            }
        })
        if (result == 0) {
            throw httpErrors.UnprocessableEntity('something went wrong while updating password');
        }
        res.send('Password updated successfully.')
    } catch (error) {
        next(error);
    }
}

module.exports = {
    loginUser,
    signupUser,
    getUserFromToken,
    logoutUser,
    sendResetPasswordForm,
    forgotPassword,
    updatePassword
}

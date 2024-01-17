const MerchantPersonalInfoModel = require('../models/merchant/personal_info.model');
const ClientPersonalInfoModel = require('../models/client/personal_info.model');
const httpErrors = require('http-errors');
const JWT = require('jsonwebtoken');
const redisClient = require('../helper/common/init_redis');
const notAuthorized = "Request not Authorized";
const { logger } = require("../helper/common/winston");

const signAccessToken = (payloadData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("payload = ", payloadData);
            const jwtAccessToken = JWT.sign(
                {
                    userId: payloadData.userId,
                    email: payloadData.email,
                },
                process.env.JWT_ACCESS_TOKEN_SECRET_KEY
            );
            console.log(jwtAccessToken);
            const expirationTimeInSeconds = 1 * 24 * 60 * 60;
            const accessTokenKey = `access_token:${payloadData.userId}`;
            await redisClient.SET(accessTokenKey, jwtAccessToken, {
                EX: expirationTimeInSeconds,
            })
            resolve(jwtAccessToken);
        } catch (error) {
            logger.error(error.message, { status: 500, path: __filename })
            console.log(error);
            reject(error);
        }
    })
}

const signRefreshToken = (payloadData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("payload = ", payloadData);
            const jwtRefreshToken = JWT.sign(
                {
                    userId: payloadData.userId,
                    email: payloadData.email,
                },
                process.env.JWT_REFRESH_TOKEN_SECRET_KEY
            );
            console.log(jwtRefreshToken);
            const expirationTimeInSeconds = 7 * 24 * 60 * 60;
            const refreshTokenKey = `refresh_token:${payloadData.userId}`;
            await redisClient.SET(refreshTokenKey, jwtRefreshToken, {
                EX: expirationTimeInSeconds,
            })

            resolve(jwtRefreshToken);
        } catch (error) {
            logger.error(error.message, { status: 500, path: __filename });
            console.log(error);
            reject(error);
        }
    })
}

const verifyAccessToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers[process.env.JWT_TOKEN_HEADER];

        if (!authorizationHeader) {
            throw httpErrors[401]('Unauthorized');
        }

        // Split the header value to separate the "Bearer" keyword from the token
        const [bearer, accessToken] = authorizationHeader.split(' ');

        if (bearer != 'Bearer' || accessToken === null) {
            throw httpErrors[401]('Invalid jwtAccessToken format.');
        }

        console.log("access token = ", accessToken);

        const payloadData = JWT.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);

        const accessTokenKey = `access_token:${payloadData.userId}`;
        console.log("payload data = ", payloadData);
        console.log("access token key = ", accessTokenKey);

        const cachedAccessToken = await redisClient.GET(accessTokenKey);

        console.log("cached access token = ", cachedAccessToken);

        if (accessToken != cachedAccessToken) {
            throw httpErrors[401](notAuthorized);
        }
        const userDetails = await ClientPersonalInfoModel.findOne({
            where: {
                id: payloadData.userId
            }
        })

        req.user = userDetails;

        next();

    } catch (error) {
        logger.error(error.message, { status: "500", path: __filename });
        console.log(error);
        next(error);
    }
}


const verifyRefreshToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers[process.env.JWT_TOKEN_HEADER];

        if (!authorizationHeader) {
            throw httpErrors[401]('Unauthorized');
        }

        // Split the header value to separate the "Bearer" keyword from the token
        const [bearer, refreshToken] = authorizationHeader.split(' ');

        if (bearer != 'Bearer' || refreshToken === null) {
            throw httpErrors[401]('Invalid jwtRefreshToken format.');
        }

        const payloadData = JWT.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);

        const refreshTokenKey = `refresh_token:${payloadData.userId}`;

        const cachedRefreshToken = await redisClient.GET(refreshTokenKey);

        if (refreshToken !== cachedRefreshToken) {
            throw httpErrors[401](notAuthorized);
        }
        const userDetails = await UserPersonalInfoModel.findOne({
            where: {
                id: payloadData.userId
            }
        })

        req.user = userDetails;

        next();

    } catch (error) {
        logger.error(error.message, { status: 500, path: __filename });
        console.log(error);
        next(error);
    }
}

const removeToken = (payloadData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessTokenKey = `access_token:${payloadData.userId}`;
            const refreshTokenKey = `refresh_token:${payloadData.userId}`;
            await redisClient.DEL(accessTokenKey);
            await redisClient.DEL(refreshTokenKey);
            resolve();
        } catch (error) {
            logger.error(error.message, { status: 500, path: __filename });
            console.log(error);
            reject(httpErrors.InternalServerError(error));
        }
    })

}

module.exports = {
    verifyAccessToken,
    removeToken,
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
}
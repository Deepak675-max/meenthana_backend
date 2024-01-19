const MerchantPersonalInfoModel = require("../../models/merchant/business_info.model");
const httpErrors = require('http-errors');
const joiAccount = require('../../helper/joi/merchant/account.joi_validation');
const sequelize = require("../../helper/common/init_postgres");

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
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        logger.error(error.message, { status: error.status, path: __filename });
        next(error);
    }
}


module.exports = {
    updateMerchantPersionalDetails
}
const UserPersonalInfoModel = require("../../models/user/user_personal_info.model");
const httpErrors = require('http-errors');
const joiAccount = require('../../helper/joi/merchant/account.joi_validation');
const sequelize = require("../../helper/common/init_postgres");

const updatePersionalDetails = async (req, res, next) => {
    try {
        const accountDetails = await joiAccount.updatePersionalDetails.validateAsync(req.body);
        const user = await UserPersonalInfoModel.findOne({
            where: {
                id: accountDetails.userId,
                isDeleted: false,
            }
        });

        if (!user) throw httpErrors.NotFound(`User with id: ${accountDetails.userId}`)


    } catch (error) {

    }
}


module.exports = {
    updatePersionalDetails
}
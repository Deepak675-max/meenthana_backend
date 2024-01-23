const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const MerchantPersonalInfoModel = sequelize.define('MerchantPersonalInfo', {
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    termAndCondition: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

MerchantPersonalInfoModel.sync().catch(error => {
    console.log(error);
})

module.exports = MerchantPersonalInfoModel;
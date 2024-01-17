const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const ForgotPasswordRequests = require('../forgetPasswordRequests.model');

const ClientPersonalInfoModel = sequelize.define('ClientPersonalInfo', {
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
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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

ClientPersonalInfoModel.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(ClientPersonalInfoModel, { foreignKey: 'userId' });

ClientPersonalInfoModel.sync().catch(error => {
    console.log(error);
})

module.exports = ClientPersonalInfoModel;
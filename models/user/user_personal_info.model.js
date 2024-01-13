const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const ForgotPasswordRequests = require('../forgetPasswordRequests.model');

const UserPersonalInfoModel = sequelize.define('UserPersonalInfo', {
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
        type: DataTypes.STRING,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: true
});

UserPersonalInfoModel.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(UserPersonalInfoModel, { foreignKey: 'userId' });

UserPersonalInfoModel.sync().catch(error => {
    console.log(error);
})

module.exports = UserPersonalInfoModel;
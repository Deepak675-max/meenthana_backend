const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const UserPersonalInfoModel = require('../user/user_personal_info.model');

const UserBusinessInfoModel = sequelize.define('UserBusinessInfo', {
    // Model attributes are defined here
    businessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    businessAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vatNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fieldOfActivity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    siretNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    businessDescription: {
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

UserBusinessInfoModel.belongsTo(UserPersonalInfoModel, { foreignKey: 'userId' });

UserBusinessInfoModel.sync().catch(error => {
    console.log(error);
})

module.exports = UserBusinessInfoModel;
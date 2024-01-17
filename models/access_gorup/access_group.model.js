const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const ClientPersonalInfoModel = require('../client/personal_info.model');
const MerchantPersonalInfoModel = require('../merchant/personal_info.model');

const AccessGroupModel = sequelize.define('AccessGroup', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdminGroup: {
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

AccessGroupModel.hasMany(ClientPersonalInfoModel, { foreignKey: "accessGroupId" });
ClientPersonalInfoModel.belongsTo(AccessGroupModel, { foreignKey: "accessGroupId" });
AccessGroupModel.hasMany(MerchantPersonalInfoModel, { foreignKey: 'accessGroupId' });
MerchantPersonalInfoModel.belongsTo(AccessGroupModel, { foreignKey: "accessGroupId" });

AccessGroupModel.sync().catch(error => {
    console.log(error);
})

module.exports = AccessGroupModel;
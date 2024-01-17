const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const AccessGroupModel = require('../access_gorup/access_group.model');
const AppRoutesModel = require('../app_route/app_routes.model');

const permissionModel = sequelize.define('Permission', {
    // Model attributes are defined here
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

AppRoutesModel.belongsToMany(AccessGroupModel, { through: "Permissions" })
AccessGroupModel.belongsToMany(AppRoutesModel, { through: "Permissions" })

permissionModel.sync().catch(error => {
    console.log(error);
})

module.exports = permissionModel;
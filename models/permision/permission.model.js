const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const PermissionModel = sequelize.define('Permission', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

PermissionModel.sync().catch(error => {
    console.log(error);
})

module.exports = PermissionModel;
const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

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

AccessGroupModel.sync().catch(error => {
    console.log(error);
})

module.exports = AccessGroupModel;
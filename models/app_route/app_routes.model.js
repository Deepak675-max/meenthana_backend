const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const AppRoutesModel = sequelize.define('AppRoute', {
    // Model attributes are defined here
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    method: {
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


AppRoutesModel.sync().catch(error => {
    console.log(error);
})

module.exports = AppRoutesModel;
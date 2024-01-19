const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const MerchantBusinessInfoModel = sequelize.define('MerchantBusinessInfo', {
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
    dateOfCreation: {
        type: DataTypes.DATE,
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


MerchantBusinessInfoModel.sync().catch(error => {
    console.log(error);
})

module.exports = MerchantBusinessInfoModel;
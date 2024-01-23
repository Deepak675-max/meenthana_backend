const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const MerchantBusinessInfoModel = sequelize.define('MerchantBusinessInfo', {
    // Model attributes are defined here
    businessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    businessEmailAddress: {
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
    labels: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    dateOfCreation: {
        type: DataTypes.DATE,
    },
    workWithStorageWareHouse: {
        type: DataTypes.BOOLEAN,
    },
    deliveredAbroad: {
        type: DataTypes.BOOLEAN,
    },
    isfranchise: {
        type: DataTypes.BOOLEAN,
    },
    annualTurnOver: {
        type: DataTypes.STRING,
    },
    openingHours: {
        type: DataTypes.JSON,
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
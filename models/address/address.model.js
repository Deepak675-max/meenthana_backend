const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const AddressModel = sequelize.define('Address', {
    // Model attributes are defined here
    title: {
        type: DataTypes.STRING,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    laneNumberAndStreet: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Warehouse', 'Shipping', 'Billig'),
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: true
});


AddressModel.sync().catch(error => {
    console.log(error);
})

module.exports = AddressModel;
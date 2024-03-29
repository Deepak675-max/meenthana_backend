const sequelize = require("../../helper/common/init_postgres")
const { DataTypes } = require('sequelize');

const ProductModel = sequelize.define('Product', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salesPriceIncludingTax: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    promotion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dimensions: {
        type: DataTypes.JSON,
        allowNull: false
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    variants: {
        type: DataTypes.JSON,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        DefaultValue: false
    }
}, {
    timestamps: true
});

ProductModel.sync().catch(error => {
    console.log(error);
})

module.exports = ProductModel;

const sequelize = require("../../helper/common/init_postgres")
const { DataTypes } = require('sequelize');

const OrderModel = sequelize.define('Order', {
    paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Compleated", "Canceled", "In Delivery"),
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        DefaultValue: false
    }
}, {
    timestamps: true
});

OrderModel.sync().catch(error => {
    console.log(error);
})

module.exports = OrderModel;

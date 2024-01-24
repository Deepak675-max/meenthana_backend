const sequelize = require("../../helper/common/init_postgres")

const DataTypes = require("sequelize");

const ReceiverModel = sequelize.define('Receiver', {
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
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

ReceiverModel.sync().catch(error => {
    console.log(error);
})

module.exports = ReceiverModel;
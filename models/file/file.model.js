const sequelize = require("../../helper/common/init_postgres")
const { DataTypes } = require('sequelize');

const FileModel = sequelize.define('File', {
    fieldname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    encoding: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        DefaultValue: false
    }
}, {
    timestamps: true
});

FileModel.sync().catch(error => {
    console.log(error);
})

module.exports = FileModel;

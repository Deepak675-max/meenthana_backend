
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.POSTGRES_DB_NAME,
    process.env.POSTGRES_USER,
    String(process.env.POSTGRES_PASS),
    {
        host: process.env.POSTGRES_HOST,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate().then(() => {
    console.log('Database Connected Successfully!.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;
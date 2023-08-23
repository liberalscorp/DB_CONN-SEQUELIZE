const Sequelize = require('sequelize'); // import sequelize as a constructor
const dotenv = require('dotenv');

dotenv.config();

const seq = new Sequelize( 
    process.env.DB_NAME, // database name
    process.env.DB_USER, // username
    process.env.DB_PASS, // password
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    }
);
// Connect to the database
seq.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = seq; // export the sequelize instance
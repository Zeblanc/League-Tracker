const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'league_tracker',
  dialect: 'mysql',
  dialectOptions: {
    // Explicitly specify MySQL 8 authentication
    authPlugins: {
      mysql_native_password: () => () => Buffer.from(process.env.DB_PASSWORD || '')
    }
  }
});

module.exports = sequelize;

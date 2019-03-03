const dotenv = require('dotenv');

process.env.APP_ENV && dotenv.config({ path: process.env.APP_ENV });
module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    host:  process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres'
  }
};

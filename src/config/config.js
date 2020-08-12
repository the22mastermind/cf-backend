require('dotenv').config();

const {
  DEV_USERNAME,
  DEV_PASSWORD,
  DEV_NAME,
  DEV_HOSTNAME,
  DEV_PORT,
  TEST_USERNAME,
  TEST_PASSWORD,
  TEST_NAME,
  TEST_HOSTNAME,
  TEST_PORT,
  PROD_USERNAME,
  PROD_PASSWORD,
  PROD_NAME,
  PROD_HOSTNAME,
  PROD_PORT,
} = process.env;

module.exports = {
  development: {
    username: DEV_USERNAME,
    password: DEV_PASSWORD,
    database: DEV_NAME,
    host: DEV_HOSTNAME,
    port: DEV_PORT,
    dialect: 'postgres',
  },
  test: {
    username: TEST_USERNAME,
    password: TEST_PASSWORD,
    database: TEST_NAME,
    host: TEST_HOSTNAME,
    port: TEST_PORT,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: PROD_USERNAME,
    password: PROD_PASSWORD,
    database: PROD_NAME,
    host: PROD_HOSTNAME,
    port: PROD_PORT,
    dialect: 'postgres',
  },
  username: DEV_USERNAME,
  password: DEV_PASSWORD,
  database: DEV_NAME,
  host: DEV_HOSTNAME,
  port: DEV_PORT,
  dialect: 'postgres',
};

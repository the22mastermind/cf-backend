import dotenv from 'dotenv';

dotenv.config();

const { TW_ACCOUNT_SID, TW_AUTH_TOKEN } = process.env;

const client = require('twilio')(TW_ACCOUNT_SID, TW_AUTH_TOKEN);

export default { client };

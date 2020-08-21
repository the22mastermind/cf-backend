import { readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require('../config/config.js')[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

readdirSync(__dirname).filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')).forEach(file => {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

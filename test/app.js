const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  Sequelize = require('sequelize'),
  models = require('../app/models'),
  dataCreation = require('./../app/models/scripts/dataCreation');

chai.use(chaiHttp);

beforeEach('drop tables, re-create them and populate sample data', done => {
  const promises = Object.keys(models)
    .filter(modelName => modelName !== 'sequelize' && modelName !== 'Sequelize')
    .map(modelName => models[modelName].destroy({ force: true, where: {} }));
  Promise.all(promises)
    .then(() => dataCreation.execute())
    .then(() => done());
});

// including all test files
const normalizedPath = path.join(__dirname, '.');
fs.readdirSync(normalizedPath).forEach(file => {
  require(`./${file}`);
});

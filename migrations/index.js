const Umzug = require('umzug'),
  Sequelize = require('sequelize'),
  config = require('./../config/'),
  logger = require('../app/logger'),
  errors = require('../app/errors'),
  sequelize = require('../app/models').sequelize;

exports.check = () => {
  const umzug = new Umzug({
    logging: logger.info,
    storage: 'sequelize',
    storageOptions: {
      sequelize
    },
    migrations: {
      params: [
        sequelize.getQueryInterface(),
        sequelize.constructor,
        function() {
          throw new Error('Migration tried to use old style "done" callback.upgrade');
        }
      ],
      path: './migrations/migrations',
      pattern: /\.js$/
    }
  });
  return umzug.pending().then(migrations => {
    if (migrations.length) {
      if (config.isDevelopment) {
        return Promise.reject('Pending migrations, run: npm run migrations');
      } else {
        return umzug.up().catch(err => {
          logger.error(err);
          return Promise.reject('There are pending migrations that could not be executed');
        });
      }
    }
  });
};

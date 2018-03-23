const path = require('path');
const camo = require('camo');

const { logger } = require('../helpers/logger')();

const dbFolder = path.join(__dirname, '..', '..', 'data');

module.exports = () => {
  camo.connect(`nedb://${dbFolder}`)
    .catch((err) => {
      logger.error(`Error during DB connection : ${JSON.stringify(err)}`);
      process.exit(0);
    })
    .then(() => logger.info(`Connection opened to DB 'nedb://${dbFolder}'`));
};

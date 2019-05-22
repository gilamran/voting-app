const findUp = require('find-up');
const dotEnvPath = findUp.sync('.env');
require('dotenv').config({ path: dotEnvPath });

const { version } = require(findUp.sync('package.json'));

////////////// CONFIG VARIABLES //////////////
const APP_VERSION = `v${version}`;

// environment
const IS_DEV = process.env.NODE_ENV !== 'production';

// server
const SERVER_PORT = process.env.PORT || 3000;
const WEBPACK_PORT = 8085; // For dev environment only

module.exports = {
  APP_VERSION,
  IS_DEV,
  SERVER_PORT,
  WEBPACK_PORT,
};

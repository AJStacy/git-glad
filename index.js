// Enable command line parameters
var argv = require("yargs").argv;

// Instantiate the logging
var winston = require("winston");
require('winston-daily-rotate-file');

var daily = new winston.transports.DailyRotateFile({
  filename: './logs/log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'info'
});

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    daily
  ]
});


if (argv.d) {
  logger.debug("Starting in daemon mode...");
  require('daemon')();
  logger.verbose("The process PID is "+process.pid+".");
}


var GitLabAutoDeploy = require("./bin/GitLabAutoDeploy");
var config = require('./config.json');

logger.debug("Instantiating the GitLab Auto Deploy server...");
// Requires a JSON config object and a Winston logger instance as parameters
var server = new GitLabAutoDeploy.Server(config, logger);
logger.debug("Starting the server...");
server.start();
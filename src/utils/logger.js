const isLoggingEnabled = process.env.ENABLE_LOGS === 'true';

const Logger = function () {};

Logger.prototype.info = function (logText) {
  if (isLoggingEnabled) {
    console.log(`${new Date()}info:::::${logText}`);
  }
};

Logger.prototype.debug = function (logText) {
    console.log(`${new Date()}debug:::::${logText}`);
};

Logger.prototype.error = function (logText) {
    console.log(`${new Date()}debug:::::${logText}`);
};

module.exports = new Logger();

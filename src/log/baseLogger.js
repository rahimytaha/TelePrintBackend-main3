const winston = require("winston");
const path = require("path");

class Logger {
  constructor(name) {
    this.logger = winston.createLogger({
      level: "debug",
      defaultMeta: { service: name },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.prettyPrint({ depth: 4, colorize: true })
          ),
        }),
        new winston.transports.File({
          filename: path.join(
            __dirname,
            `../../logs/${name}`,
            `${name} error.log`
          ),
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(
            __dirname,
            `../../logs/${name}`,
            `${name} combined.log`
          ),
        }),
      ],
    });
  }
  debug(log, metadata) {
    this.logger.debug(log, metadata);
  }
  info(log, metadata) {
    this.logger.info(log, metadata);
  }
  warn(log, metadata) {
    this.logger.warn(log, metadata);
  }
  error(log, metadata) {
    this.logger.error(log, metadata);
  }
}

module.exports.getLogger = function (name) {
  return new Logger(name);
};

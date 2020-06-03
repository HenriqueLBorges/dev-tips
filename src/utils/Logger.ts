import winston from "winston";
const { combine, timestamp, printf } = winston.format;

class Logger {

  public readonly logger: winston.Logger;

  constructor() {
    const myFormat = printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`);
    this.logger = winston.createLogger({
      format: combine(
        timestamp(),
        myFormat,
      ),
      transports: [
        new winston.transports.Console({
          format: combine(
            timestamp(),
            myFormat,
          ),
        }),
      ],
    });
  }
}

export default new Logger().logger;

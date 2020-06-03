"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf } = winston_1.default.format;
class Logger {
    constructor() {
        const myFormat = printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`);
        this.logger = winston_1.default.createLogger({
            format: combine(timestamp(), myFormat),
            transports: [
                new winston_1.default.transports.Console({
                    format: combine(timestamp(), myFormat),
                }),
            ],
        });
    }
}
exports.default = new Logger().logger;

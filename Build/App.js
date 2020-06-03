"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Logger_1 = __importDefault(require("./utils/Logger"));
// Routers
const Api_1 = __importDefault(require("./routers/Api"));
const Cat_1 = __importDefault(require("./routers/Cat"));
class App {
    constructor() {
        this.app = express();
        this.port = process.env.port || process.env.PORT || "3030";
        this.config();
        this.app.listen(this.port, () => {
            Logger_1.default.info(`dev-tips listening on port ${this.port}`);
        });
    }
    config() {
        this.app.use(express.json());
        this.registerRouters();
    }
    registerRouters() {
        this.app.use("/cat", Cat_1.default);
        this.app.use("/api", Api_1.default);
    }
}
exports.default = new App();

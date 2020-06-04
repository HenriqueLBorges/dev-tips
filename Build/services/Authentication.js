"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const uuid_1 = require("uuid");
const MongoAdapter_1 = __importDefault(require("../adapters/Mongo/MongoAdapter"));
const Logger_1 = __importDefault(require("../utils/Logger"));
class Authentication {
    constructor() {
        this.secret = process.env.secret ? process.env.secret : "secret";
        const dbName = process.env.dbName ? process.env.dbName : "dev-tips";
        const collection = process.env.collection ? process.env.collection : "users";
        const host = process.env.host ? process.env.host : "localhost";
        const port = process.env.port ? process.env.port : "27017";
        const user = process.env.user ? process.env.user : "admin";
        const password = process.env.password ? process.env.password : "admin";
        this.db = new MongoAdapter_1.default(dbName, collection, host, port, user, password);
        this.db.connect();
    }
    validateToken(token) {
        try {
            const user = jwt.verify(token, this.secret);
            Logger_1.default.info("Validated token.");
            return user;
        }
        catch (err) {
            Logger_1.default.info(`Error while validating token ${token}.`);
            return null;
        }
    }
    createUser(firstName, lastName, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { username };
            const userInDB = yield this.db.get(query);
            if (userInDB === null) {
                const user = { id: uuid_1.v4(), firstName, lastName, username, password, when: new Date() };
                Logger_1.default.info(`User ${user.id} created`);
                yield this.db.save(user);
                return user;
            }
            else {
                Logger_1.default.info("User not created");
                return null;
            }
        });
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Authenticated user");
            const query = { username, password };
            const userInDB = yield this.db.get(query);
            if (userInDB !== null) {
                return this.generateToken(username);
            }
            else {
                Logger_1.default.info("User not created");
                return null;
            }
        });
    }
    generateToken(data) {
        Logger_1.default.info("Generated token");
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            username: data,
        }, this.secret);
    }
}
exports.default = new Authentication();

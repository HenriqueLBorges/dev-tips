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
        const dbName = process.env.dbName ? process.env.dbName : "test";
        const host = process.env.host ? process.env.host : "localhost";
        const port = process.env.port ? process.env.port : "27017";
        const user = process.env.user ? process.env.user : "";
        const password = process.env.password ? process.env.password : "";
        this.db = new MongoAdapter_1.default(dbName, host, port, user, password);
        this.db.connect();
    }
    validateToken(token) {
        try {
            jwt.verify(token, this.secret);
            Logger_1.default.info("Validated token.");
            return true;
        }
        catch (err) {
            Logger_1.default.info("Error while validating token.");
            return false;
        }
    }
    createUser(firstName, lastName, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { username, password };
            const userInDB = null; // await this.db.get(query, UsersModel);
            Logger_1.default.info("Created user");
            if (userInDB === null) {
                const user = { id: uuid_1.v4(), firstName, lastName, username, password, registeredAt: new Date() };
                yield this.db.save(user, "users");
                return user;
            }
            else {
                return null;
            }
        });
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Authenticated user");
            const query = { username, password };
            const user = yield this.db.get(query, 1, "users");
            return this.generateToken(user.username);
        });
    }
    generateToken(data) {
        Logger_1.default.info("Generated token");
        return jwt.sign({
            data,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }, this.secret);
    }
}
exports.default = new Authentication();

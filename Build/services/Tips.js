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
const uuid_1 = require("uuid");
const MongoAdapter_1 = __importDefault(require("../adapters/Mongo/MongoAdapter"));
const Logger_1 = __importDefault(require("../utils/Logger"));
class Tips {
    constructor() {
        const dbName = process.env.dbName ? process.env.dbName : "dev-tips";
        const collection = process.env.collection ? process.env.collection : "tips";
        const host = process.env.host ? process.env.host : "localhost";
        const port = process.env.port ? process.env.port : "27017";
        const user = process.env.user ? process.env.user : "admin";
        const password = process.env.password ? process.env.password : "admin";
        this.db = new MongoAdapter_1.default(dbName, collection, host, port, user, password);
        this.db.connect();
    }
    createTip(title, body, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const tip = { id: uuid_1.v4(), title, body, from, when: new Date() };
            const savedItem = yield this.db.save(tip);
            return savedItem._id;
        });
    }
    getTip(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tip = yield this.db.getByID(id);
            if (tip !== null) {
                return tip;
            }
            else {
                Logger_1.default.info("Tip not found");
                return null;
            }
        });
    }
    getTips() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            const tip = yield this.db.getMultiple(query);
            if (tip !== null) {
                return tip;
            }
            else {
                Logger_1.default.info("Tips not found");
                return null;
            }
        });
    }
    updateTip(id, from, title, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { id };
            const titleKey = "title";
            const bodyKey = "body";
            if (title) {
                data[titleKey] = title;
            }
            if (body) {
                data[bodyKey] = body;
            }
            const oldTip = yield this.db.getByID(id);
            if (oldTip !== null) {
                if (oldTip.from === from) {
                    const tip = yield this.db.update(id, data);
                    return `Tip ${id} updated`;
                }
                else {
                    Logger_1.default.info("Tip is not yours");
                    return `Tip ${id} is not yours`;
                }
            }
            else {
                Logger_1.default.info("Tip not found");
                return `Tip ${id} not found`;
            }
        });
    }
    deleteTip(id, from, title, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { id };
            const titleKey = "title";
            const bodyKey = "body";
            if (title) {
                data[titleKey] = title;
            }
            if (body) {
                data[bodyKey] = body;
            }
            const oldTip = yield this.db.getByID(id);
            if (oldTip !== null) {
                if (oldTip.from === from) {
                    yield this.db.remove(id);
                    return `Tip ${id} deleted`;
                }
                else {
                    Logger_1.default.info("Tip is not yours");
                    return `Tip ${id} is not yours`;
                }
            }
            else {
                Logger_1.default.info("Tip not found");
                return `Tip ${id} not found`;
            }
        });
    }
}
exports.default = new Tips();

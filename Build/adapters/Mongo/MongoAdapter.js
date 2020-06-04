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
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
const ConnectorConnectError_1 = __importDefault(require("./ConnectorConnectError"));
const ConnectorSaveError_1 = __importDefault(require("./ConnectorSaveError"));
class MongoAdapter {
    constructor(dbName, collection, host, port, user, password) {
        this.instance = new mongoose_1.default.Mongoose();
        this.model = mongoose_1.default.Model;
        this.connected = false;
        this.dbName = dbName;
        this.collection = collection;
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        const schema = new this.instance.Schema({}, { strict: false });
        this.model = this.instance.model(this.collection, schema);
        this.registerEvents();
    }
    save(document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.connect) {
                    this.connect();
                }
                const item = new this.model(document);
                yield item.save();
                this.logInfo(`Saved document`);
                return item;
            }
            catch (error) {
                const message = `Error while saving document. Error = ${error}`;
                this.logError(message);
                throw new ConnectorSaveError_1.default(message);
            }
        });
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connect) {
                this.connect();
            }
            return yield this.model.findOne(query);
        });
    }
    getMultiple(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connect) {
                this.connect();
            }
            return yield this.model.find(query);
        });
    }
    getByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connect) {
                this.connect();
            }
            return yield this.model.findById(id).lean();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connect) {
                this.connect();
            }
            return yield this.model.findByIdAndUpdate(id, data);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connect) {
                this.connect();
            }
            return yield this.model.findByIdAndDelete(id);
        });
    }
    isConnected() {
        return this.connected;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logInfo("Connecting...");
                if (!this.isConnected()) {
                    const url = `mongodb://${this.auth()}${this.host}:${this.port}/${this.dbName}`;
                    yield this.instance.connect(url, { useNewUrlParser: true, authSource: "admin", useFindAndModify: false, useUnifiedTopology: true });
                    this.connected = true;
                    this.logInfo("Connected");
                }
                else {
                    this.logInfo("Already connected");
                }
            }
            catch (error) {
                const message = `Error while connecting. Error = ${error}`;
                this.logError(message);
                throw new ConnectorConnectError_1.default(message);
            }
        });
    }
    registerEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.instance.connection.on("disconnected", () => {
                if (this.connected) {
                    this.connected = false;
                    this.logError("Disconnected");
                    const timeoutFunc = () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield this.connect();
                        }
                        catch (error) {
                            if (!(error instanceof ConnectorConnectError_1.default)) {
                                throw (error);
                            }
                            else {
                                yield setTimeout(timeoutFunc, 3000);
                            }
                        }
                    });
                    setTimeout(timeoutFunc, 3000);
                }
            });
        });
    }
    logError(content) {
        Logger_1.default.error(`Database - ${content}`);
    }
    logInfo(content) {
        Logger_1.default.info(`Database - ${content}`);
    }
    logSuccess(content) {
        Logger_1.default.info(`Database - ${content}`);
    }
    auth() {
        if (this.user !== "" && this.password !== "") {
            return `${this.user}:${this.password}@`;
        }
        return "";
    }
}
exports.default = MongoAdapter;

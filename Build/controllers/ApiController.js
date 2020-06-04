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
const Authentication_1 = __importDefault(require("../services/Authentication"));
const Tips_1 = __importDefault(require("../services/Tips"));
class ApiController {
    static getTip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Tips_1.default.getTip(req.query.tipID);
            return res.json(result);
        });
    }
    static getTips(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Tips_1.default.getTips();
            return res.json(result);
        });
    }
    static postTip(req, res, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield Tips_1.default.createTip(req.body.title, req.body.body, from);
            const message = id !== null ? `Tip ${id} created` : "Tip not created";
            return res.json(message);
        });
    }
    static deleteTip(req, res, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipID = req.query.tipID;
            const message = yield Tips_1.default.deleteTip(tipID, from, req.body.title, req.body.body);
            return res.json(message);
        });
    }
    static updateTip(req, res, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipID = req.query.tipID;
            const message = yield Tips_1.default.updateTip(tipID, from, req.body.title, req.body.body);
            return res.json(message);
        });
    }
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Authentication_1.default.createUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password);
            const message = result !== null ? "User created" : "User not created";
            return res.json(message);
        });
    }
    static authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Authentication_1.default.authenticate(req.body.username, req.body.password);
            return res.json({ token: result });
        });
    }
}
exports.default = ApiController;

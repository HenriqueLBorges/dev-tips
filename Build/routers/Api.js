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
const express = require("express");
const ApiController_1 = __importDefault(require("../controllers/ApiController"));
const Authentication_1 = __importDefault(require("../services/Authentication"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const router = express.Router();
const log = (method, route, status) => {
    Logger_1.default.info(`${method} - ${route} - Status code: ${status}`);
};
router.get("/tip", (req, res, next) => {
    const hasPassedID = !!req.query.tipID;
    if (hasPassedID) {
        const id = req.query.tipID;
        const response = ApiController_1.default.getTip(id, res);
        log(req.method, req.route.path, res.statusCode);
        return response;
    }
    else {
        const response = ApiController_1.default.getTips(res);
        log(req.method, req.route.path, res.statusCode);
        return response;
    }
});
router.post("/tip", (req, res, next) => {
    const hasToken = !!req.params.token;
    const token = hasToken ? req.params.token : "";
    if (Authentication_1.default.validateToken(token)) {
        const response = res.json("created");
        log(req.method, req.route.path, res.statusCode);
        return response;
    }
    else {
        const response = res.status(400).json("Not authenticated");
        log(req.method, req.route.path, res.statusCode);
        return response;
    }
});
router.put("/tip", (req, res, next) => {
    res.sendStatus(200);
});
router.delete("/tip", (req, res, next) => {
    res.sendStatus(200);
});
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hasAllKeys = req.body && req.body.firstName
        && req.body.lastName && req.body.username && req.body.password;
    if (hasAllKeys) {
        const result = yield Authentication_1.default.createUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password);
        const message = result !== null ? "User created" : "User not created";
        res.json(message);
    }
    else {
        res.json("Missing params");
    }
}));
exports.default = router;

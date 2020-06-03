"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiController {
    static getTip(id, res) {
        return res.json(id);
    }
    static getTips(res) {
        return res.sendStatus(200);
    }
    static postTip(res) {
        return res.sendStatus(200);
    }
    static deleteTip(id, res) {
        return res.sendStatus(200);
    }
    static updateTip(id, res) {
        return res.sendStatus(200);
    }
}
exports.default = ApiController;

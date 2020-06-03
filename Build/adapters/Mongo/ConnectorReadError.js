"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectorReadError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.default = ConnectorReadError;

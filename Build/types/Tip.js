"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ITip {
    constructor(id, title, body, from, when) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.from = from;
        this.when = when;
    }
    getID() {
        return this.id;
    }
    getTitle() {
        return this.title;
    }
    getBody() {
        return this.body;
    }
    getFrom() {
        return this.from;
    }
    getWhen() {
        return this.when;
    }
}
exports.default = ITip;

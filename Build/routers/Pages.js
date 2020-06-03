"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get("/home", (req, res, next) => {
    res.render("index");
});
router.get("/login", (req, res, next) => {
    res.sendStatus(200);
});
exports.default = router;

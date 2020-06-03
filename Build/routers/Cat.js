"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get("/environment", (req, res, next) => {
    res.json(process.env);
});
router.get("/health-check", (req, res, next) => {
    res.sendStatus(200);
});
exports.default = router;

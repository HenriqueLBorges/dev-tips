import express = require("express");
const router: express.Router = express.Router();

router.get("/environment",
    (req: express.Request,  res: express.Response,  next: express.NextFunction) => {
    res.json(process.env);
});

router.get("/health-check",
    (req: express.Request,  res: express.Response, next: express.NextFunction) => {
    res.sendStatus(200);
});

export default router;

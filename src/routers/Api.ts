import express = require("express");
import ApiController from "../controllers/ApiController";
import Authentication from "../services/Authentication";
import Logger from "../utils/Logger";

const router: express.Router = express.Router();
const log = (method: string, route: string, status: number): void => {
    Logger.info(`${method} - ${route} - Status code: ${status}`);
};

router.get("/tip",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasPassedID = !!req.query.tipID;
        if (hasPassedID) {
            const id = req.query.tipID as string;
            const response = ApiController.getTip(id, res);
            log(req.method, req.route.path, res.statusCode);
            return response;
        } else {
            const response = ApiController.getTips(res);
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

router.post("/tip",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasToken = !!req.params.token;
        const token = hasToken ? req.params.token as string : "";
        if (Authentication.validateToken(token)) {
            const response = res.json("created");
            log(req.method, req.route.path, res.statusCode);
            return response;
        } else {
            const response = res.status(400).json("Not authenticated");
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

router.put("/tip",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.sendStatus(200);
    });

router.delete("/tip",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.sendStatus(200);
    });

router.post("/login",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasAllKeys = req.body && req.body.firstName
            && req.body.lastName && req.body.username && req.body.password;

        if (hasAllKeys) {
            const result = await Authentication.createUser(
                req.body.firstName, req.body.lastName, req.body.username, req.body.password);
            const message = result !== null ? "User created" : "User not created";
            res.json(message);
        } else {
            res.json("Missing params");
        }
    });

export default router;

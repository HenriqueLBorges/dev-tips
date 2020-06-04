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
            const response = ApiController.getTip(req, res);
            log(req.method, req.route.path, res.statusCode);
            return response;
        } else {
            const response = ApiController.getTips(req, res);
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

router.post("/tip",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasToken = !!req.headers.authorization;
        const token = hasToken ? (req.headers.authorization as string).split(" ")[1] as string : "";
        const user = Authentication.validateToken(token);
        if (user !== null) {
            const hasAllKeys = req.body.title && req.body.body;

            if (hasAllKeys) {
                const response = ApiController.postTip(req, res, user.username);
                log(req.method, req.route.path, res.statusCode);
                return response;
            } else {
                const response = res.json("Missing params");
                log(req.method, req.route.path, res.statusCode);
                return response;
            }

        } else {
            const response = res.status(400).json("Not authenticated");
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

router.put("/tip",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasToken = !!req.headers.authorization;
        const token = hasToken ? (req.headers.authorization as string).split(" ")[1] as string : "";
        const user = Authentication.validateToken(token);
        if (user !== null) {
            const hasKeys = req.query.tipID && (req.body.title || req.body.body);

            if (hasKeys) {
                const response = ApiController.updateTip(req, res, user.username);
                log(req.method, req.route.path, res.statusCode);
                return response;
            } else {
                const response = res.json("Missing params");
                log(req.method, req.route.path, res.statusCode);
                return response;
            }

        } else {
            const response = res.status(400).json("Not authenticated");
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

router.delete("/tip",
(req: express.Request, res: express.Response, next: express.NextFunction) => {
    const hasToken = !!req.headers.authorization;
    const token = hasToken ? (req.headers.authorization as string).split(" ")[1] as string : "";
    const user = Authentication.validateToken(token);
    if (user !== null) {
        const response = ApiController.deleteTip(req, res, user.username);
        log(req.method, req.route.path, res.statusCode);
        return response;
    } else {
        const response = res.status(400).json("Not authenticated");
        log(req.method, req.route.path, res.statusCode);
        return response;
    }
});

router.post("/user",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasAllKeys = req.body && req.body.firstName
            && req.body.lastName && req.body.username && req.body.password;

        if (hasAllKeys) {
            const response = ApiController.createUser(req, res);
            log(req.method, req.route.path, res.statusCode);
            return response;
        } else {
            const response = res.json("Missing params");
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

router.post("/authenticate",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const hasAllKeys = req.body.username && req.body.password;

        if (hasAllKeys) {
            const response = ApiController.authenticate(req, res);
            log(req.method, req.route.path, res.statusCode);
            return response;
        } else {
            const response = res.json("Missing params");
            log(req.method, req.route.path, res.statusCode);
            return response;
        }
    });

export default router;

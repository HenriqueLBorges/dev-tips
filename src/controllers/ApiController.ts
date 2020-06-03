import express = require("express");

export default class ApiController {

    public static getTip(id: string, res: express.Response): express.Response {
        return res.json(id);
    }

    public static getTips(res: express.Response): express.Response {
        return res.sendStatus(200);
    }

    public static postTip(res: express.Response): express.Response {
        return res.sendStatus(200);
    }

    public static deleteTip(id: string, res: express.Response): express.Response {
        return res.sendStatus(200);
    }

    public static updateTip(id: string, res: express.Response): express.Response {
        return res.sendStatus(200);
    }

}

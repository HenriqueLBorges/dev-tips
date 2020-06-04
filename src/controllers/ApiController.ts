import express = require("express");
import Authentication from "../services/Authentication";
import Tips from "../services/Tips";

export default class ApiController {

    public static async getTip(req: express.Request, res: express.Response): Promise<express.Response> {
        const result = await Tips.getTip(req.query.tipID as string);
        return res.json(result);
    }

    public static async getTips(req: express.Request, res: express.Response): Promise<express.Response> {
        const result = await Tips.getTips();
        return res.json(result);
    }

    public static async postTip(req: express.Request, res: express.Response, from: any): Promise<express.Response> {
        const id = await Tips.createTip(req.body.title, req.body.body, from);
        const message = id !== null ? `Tip ${id} created` : "Tip not created";
        return res.json(message);
    }

    public static async deleteTip(
            req: express.Request, res: express.Response, from: string): Promise<express.Response> {
        const tipID = req.query.tipID as string;
        const message = await Tips.deleteTip(tipID, from, req.body.title, req.body.body);
        return res.json(message);
    }

    public static async updateTip(
            req: express.Request, res: express.Response, from: string): Promise<express.Response> {
        const tipID = req.query.tipID as string;
        const message = await Tips.updateTip(tipID, from, req.body.title, req.body.body);
        return res.json(message);
    }

    public static async createUser(req: express.Request, res: express.Response): Promise<express.Response> {
        const result = await Authentication.createUser(
            req.body.firstName, req.body.lastName, req.body.username, req.body.password);
        const message = result !== null ? "User created" : "User not created";
        return res.json(message);
    }

    public static async authenticate(req: express.Request, res: express.Response): Promise<express.Response> {
        const result = await Authentication.authenticate(req.body.username, req.body.password);
        return res.json({token: result});
    }

}

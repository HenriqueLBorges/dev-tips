import { v4 as uuidv4 } from "uuid";
import MongoAdapter from "../adapters/Mongo/MongoAdapter";
import ITip from "../types/ITip";
import IUser from "../types/IUser";
import Logger from "../utils/Logger";

class Tips {
    private db: MongoAdapter;

    constructor() {
        const dbName: string = process.env.dbName ? process.env.dbName : "dev-tips";
        const collection: string = process.env.collection ? process.env.collection : "tips";
        const host: string = process.env.host ? process.env.host : "localhost";
        const port: string = process.env.port ? process.env.port : "27017";
        const user: string = process.env.user ? process.env.user : "admin";
        const password: string = process.env.password ? process.env.password : "admin";
        this.db = new MongoAdapter(dbName, collection, host, port, user, password);
        this.db.connect();
    }

    public async createTip(title: string, body: string, from: string): Promise<string> {
        const tip = { id: uuidv4(), title, body, from, when: new Date() } as ITip;
        const savedItem = await this.db.save(tip);
        return savedItem._id;
    }

    public async getTip(id: string): Promise<ITip | null> {
        const tip = await this.db.getByID(id) as ITip;
        if (tip !== null) {
            return tip;
        } else {
            Logger.info("Tip not found");
            return null;
        }
    }

    public async getTips(): Promise<ITip | null> {
        const query: any = { };
        const tip = await this.db.getMultiple(query) as ITip;
        if (tip !== null) {
            return tip;
        } else {
            Logger.info("Tips not found");
            return null;
        }
    }

    public async updateTip(id: string, from: string, title?: string, body?: string): Promise<string> {
        const data = {id} as any;
        const titleKey = "title";
        const bodyKey = "body";
        if (title) {
            data[titleKey] = title;
        }
        if (body) {
            data[bodyKey] = body;
        }
        const oldTip = await this.db.getByID(id) as ITip;

        if (oldTip !== null) {
            if (oldTip.from === from) {
                const tip = await this.db.update(id, data) as ITip;
                return `Tip ${id} updated`;
            } else {
                Logger.info("Tip is not yours");
                return `Tip ${id} is not yours`;
            }
        } else {
            Logger.info("Tip not found");
            return `Tip ${id} not found`;
        }
    }

    public async deleteTip(id: string, from: string, title?: string, body?: string): Promise<string> {
        const data = {id} as any;
        const titleKey = "title";
        const bodyKey = "body";
        if (title) {
            data[titleKey] = title;
        }
        if (body) {
            data[bodyKey] = body;
        }
        const oldTip = await this.db.getByID(id) as ITip;

        if (oldTip !== null) {
            if (oldTip.from === from) {
                await this.db.remove(id);
                return `Tip ${id} deleted`;
            } else {
                Logger.info("Tip is not yours");
                return `Tip ${id} is not yours`;
            }
        } else {
            Logger.info("Tip not found");
            return `Tip ${id} not found`;
        }
    }
}

export default new Tips();

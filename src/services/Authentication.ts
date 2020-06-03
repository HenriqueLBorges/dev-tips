import jwt = require("jsonwebtoken");
import { v4 as uuidv4 } from "uuid";
import UsersModel from "../adapters/Mongo/models/Users";
import MongoAdapter from "../adapters/Mongo/MongoAdapter";
import IUser from "../types/IUser";
import Logger from "../utils/Logger";

class Authentication {
    private secret: string = process.env.secret ? process.env.secret : "secret";
    private db: MongoAdapter;

    constructor() {
        const dbName: string = process.env.dbName ? process.env.dbName : "test";
        const host: string = process.env.host ? process.env.host : "localhost";
        const port: string = process.env.port ? process.env.port : "27017";
        const user: string = process.env.user ? process.env.user : "";
        const password: string = process.env.password ? process.env.password : "";
        this.db = new MongoAdapter(dbName, host, port, user, password);
        this.db.connect();
    }

    public validateToken(token: string): boolean {
        try {
            jwt.verify(token, this.secret);
            Logger.info("Validated token.");
            return true;
        } catch (err) {
            Logger.info("Error while validating token.");
            return false;
        }
    }

    public async createUser(
        firstName: string, lastName: string, username: string, password: string): Promise<IUser|null> {
        const query: any = { username, password };
        const userInDB = null; // await this.db.get(query, UsersModel);
        Logger.info("Created user");
        if (userInDB === null) {
            const user = { id: uuidv4(), firstName, lastName, username, password, registeredAt: new Date() } as IUser;
            await this.db.save(user, "users");
            return user;
        } else {
            return null;
        }
    }

    public async authenticate(username: string, password: string): Promise<string> {
        Logger.info("Authenticated user");
        const query: any = { username, password };
        const user = await this.db.get(query, 1, "users") as IUser;
        return this.generateToken(user.username);
    }

    private generateToken(data: string): string {
        Logger.info("Generated token");
        return jwt.sign({
            data,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }, this.secret);
    }
}

export default new Authentication();

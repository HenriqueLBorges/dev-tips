import jwt = require("jsonwebtoken");
import { v4 as uuidv4 } from "uuid";
import MongoAdapter from "../adapters/Mongo/MongoAdapter";
import IUser from "../types/IUser";
import Logger from "../utils/Logger";

class Authentication {
    private secret: string = process.env.secret ? process.env.secret : "secret";
    private db: MongoAdapter;

    constructor() {
        const dbName: string = process.env.dbName ? process.env.dbName : "dev-tips";
        const authenticationCollection: string = process.env.authenticationCollection ?
            process.env.authenticationCollection : "users";
        const dbHost: string = process.env.dbHost ? process.env.dbHost : "localhost";
        const port: string = process.env.dbPort ? process.env.dbPort : "27017";
        const user: string = process.env.dbUser ? process.env.dbUser : "admin";
        const password: string = process.env.dbPassword ? process.env.dbPassword : "admin";
        this.db = new MongoAdapter(dbName, authenticationCollection, dbHost, port, user, password);
        this.db.connect();
    }

    public validateToken(token: string): any | null {
        try {
            const user = jwt.verify(token, this.secret);
            Logger.info("Validated token.");
            return user;
        } catch (err) {
            Logger.info(`Error while validating token ${token}.`);
            return null;
        }
    }

    public async createUser(
        firstName: string, lastName: string, username: string, password: string): Promise<IUser | null> {
        const query: any = { username };
        const userInDB = await this.db.get(query);
        if (userInDB === null) {
            const user = { id: uuidv4(), firstName, lastName, username, password, when: new Date() } as IUser;
            Logger.info(`User ${user.id} created`);
            await this.db.save(user);
            return user;
        } else {
            Logger.info("User not created");
            return null;
        }
    }

    public async authenticate(username: string, password: string): Promise<string|null> {
        Logger.info("Authenticated user");
        const query: any = { username, password };
        const userInDB = await this.db.get(query) as IUser;

        if (userInDB !== null) {
            return this.generateToken(username);
        } else {
            Logger.info("User not created");
            return null;
        }
    }

    private generateToken(data: string): string {
        Logger.info("Generated token");
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            username: data,
        }, this.secret);
    }
}

export default new Authentication();

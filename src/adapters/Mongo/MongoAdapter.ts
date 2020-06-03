import mongoose = require("mongoose");
import IMongoPort from "../../ports/IMongoPort";
import Logger from "../../utils/Logger";
import ConnectorConnectError from "./ConnectorConnectError";
import ConnectorReadError from "./ConnectorReadError";
import ConnectorSaveError from "./ConnectorSaveError";

export default class MongoAdapter implements IMongoPort {

    private dbName: string;
    private host: string;
    private port: string;
    private user: string;
    private password: string;
    private instance = new mongoose.Mongoose();
    private model = mongoose.Model;
    private connected: boolean = false;

    constructor(dbName: string, host: string,
                port: string, user: string, password: string) {
        this.dbName = dbName;
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        this.registerEvents();
    }

    public async save(document: any, collection: string): Promise<void> {
        try {
            if (!this.connect) {
                this.connect();
            }
            const Model = this.getMongooseModel(document, collection);
            const item = new Model(document);
            await item.save();
            this.logInfo(`Saved document`);
        } catch (error) {
            const message = `Error while saving document. Error = ${error}`;
            this.logError(message);
            throw new ConnectorSaveError(message);
        }
    }

    public async get(query: JSON, schema: any, collection: string): Promise<any> {
        const Model = this.getMongooseModel(schema, collection);

        if (!this.connect) {
            this.connect();
        }
        return await Model.findOne(query);
    }

    public isConnected(): boolean {
        return this.connected;
    }

    public async connect(): Promise<void> {
        try {
            this.logInfo("Connecting...");
            if (!this.isConnected()) {
                const url = `mongodb://${this.auth()}${this.host}:${this.port}/${this.dbName}`;
                await this.instance.connect(url,
                    { useNewUrlParser: true, authSource: "admin", useFindAndModify: false, useUnifiedTopology: true });
                this.connected = true;
                this.logInfo("Connected");
            } else {
                this.logInfo("Already connected");
            }
        } catch (error) {
            const message = `Error while connecting. Error = ${error}`;
            this.logError(message);
            throw new ConnectorConnectError(message);
        }
    }

    public async registerEvents(): Promise<void> {

        this.instance.connection.on("disconnected", () => {
            if (this.connected) {
                this.connected = false;
                this.logError("Disconnected");
                const timeoutFunc = async () => {
                    try {
                        await this.connect();
                    } catch (error) {
                        if (!(error instanceof ConnectorConnectError)) {
                            throw (error);
                        } else {
                            await setTimeout(timeoutFunc, 3000);
                        }
                    }
                };
                setTimeout(timeoutFunc, 3000);
            }
        });
    }

    public logError(content: string): void {
        Logger.error(`Database - ${content}`);
    }

    public logInfo(content: string): void {
        Logger.info(`Database - ${content}`);
    }

    public logSuccess(content: string): void {
        Logger.info(`Database - ${content}`);
    }

    private auth(): string {
        if (this.user !== "" && this.password !== "") {
            return `${this.user}:${this.password}@`;
        }
        return "";
    }

    private getMongooseModel(schema: any, collection: string): mongoose.Model<any> {
        const mongooseSchema = new this.instance.Schema(schema, { strict: false });
        return this.instance.model(collection, mongooseSchema);
    }
}

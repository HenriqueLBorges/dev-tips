import mongoose, { Schema } from "mongoose";
import IMongoPort from "../../ports/IMongoPort";
import Logger from "../../utils/Logger";
import ConnectorConnectError from "./ConnectorConnectError";
import ConnectorReadError from "./ConnectorReadError";
import ConnectorSaveError from "./ConnectorSaveError";

export default class MongoAdapter implements IMongoPort {

    private dbName: string;
    private collection: string;
    private host: string;
    private port: string;
    private user: string;
    private password: string;
    private instance = new mongoose.Mongoose();
    private model = mongoose.Model;
    private connected: boolean = false;

    constructor(dbName: string, collection: string, host: string,
                port: string, user: string, password: string) {
        this.dbName = dbName;
        this.collection = collection;
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        const schema = new this.instance.Schema({}, { strict: false });
        this.model = this.instance.model(this.collection, schema);
        this.registerEvents();
    }

    public async save(document: any): Promise<any> {
        try {
            if (!this.connect) {
                this.connect();
            }
            const item = new this.model(document);
            await item.save();
            this.logInfo(`Saved document`);
            return item;
        } catch (error) {
            const message = `Error while saving document. Error = ${error}`;
            this.logError(message);
            throw new ConnectorSaveError(message);
        }
    }

    public async get(query: JSON): Promise<any> {

        if (!this.connect) {
            this.connect();
        }

        return await this.model.findOne(query);
    }

    public async getMultiple(query: JSON): Promise<any> {

        if (!this.connect) {
            this.connect();
        }

        return await this.model.find(query);
    }

    public async getByID(id: string): Promise<any> {

        if (!this.connect) {
            this.connect();
        }

        return await this.model.findById(id).lean();
    }

    public async update(id: string, data: any): Promise<any> {

        if (!this.connect) {
            this.connect();
        }
        return await this.model.findByIdAndUpdate(id, data);
    }

    public async remove(id: string): Promise<any> {

        if (!this.connect) {
            this.connect();
        }
        return await this.model.findByIdAndDelete(id);
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

}

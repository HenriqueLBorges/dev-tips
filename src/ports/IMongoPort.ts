export default interface IMongoPort {
    save(document: any, model: any): Promise<void>;
    get(query: JSON, das: any, model: any): Promise<any>;
}

import User from "./IUser";

export default  class ITip {
    private id: string;
    private title: string;
    private body: string;
    private from: User;
    private when: Date;

    constructor(id: string, title: string, body: string, from: User, when: Date) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.from = from;
        this.when = when;
    }

    public getID(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getBody(): string {
        return this.body;
    }

    public getFrom(): User {
        return this.from;
    }

    public getWhen(): Date {
        return this.when;
    }
}

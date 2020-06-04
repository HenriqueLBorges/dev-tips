import { Document } from "mongoose";

export default interface ITip extends Document {
    id: string;
    title: string;
    body: string;
    from: string;
    when: Date;
}

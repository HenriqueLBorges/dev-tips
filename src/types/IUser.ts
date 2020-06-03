import { Document } from "mongoose";

export default interface IUser extends Document {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly username: string;
    readonly password: string;
    readonly registeredAt: Date;
}

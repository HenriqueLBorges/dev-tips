import mongoose, { Schema } from "mongoose";
import IUser from "../../../types/IUser";

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    registeredAt: { type: Date, required: true },
    username: { type: String, required: true },
});

// Export the model and return your IUser interface
export default mongoose.model("users", UserSchema);

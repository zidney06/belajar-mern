import mongoose, { InferSchemaType } from "mongoose";
import { UserDataType } from "./userDataModel";

const userAuthSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	userData: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "UserData",
	},
});

export type UserAuthType = InferSchemaType<typeof userAuthSchema>;

const UserAuth = mongoose.model("UserAuth", userAuthSchema);

export default UserAuth;

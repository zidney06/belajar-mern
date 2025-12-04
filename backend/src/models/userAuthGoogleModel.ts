import mongoose, { InferSchemaType } from "mongoose";

const userAuthGoogleSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
	},
	userData: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "UserData",
	},
});

export type UserAuthGoogleType = InferSchemaType<typeof userAuthGoogleSchema>;

const UserAuthGoogle = mongoose.model("UserAuthGoogle", userAuthGoogleSchema);

export default UserAuthGoogle;

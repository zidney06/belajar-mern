import mongoose from "mongoose";

const BLTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: "1h",
	},
});

const BLToken = mongoose.model("BLToken", BLTokenSchema);

export default BLToken;

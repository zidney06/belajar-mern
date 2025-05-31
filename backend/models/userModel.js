import mongoose from "mongoose";
import { skemaBarang } from "./product.model.js";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		orderList: {
			type: [skemaBarang],
		},
	},
	{
		timestamps: true, //jika true, maka saaat memasukan data kedalam db akan ada satu data tambahan yaitu data tanggal
	}
);

const User = mongoose.model("User", userSchema);

export default User;

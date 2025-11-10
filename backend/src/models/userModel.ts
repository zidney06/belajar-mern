import mongoose, { InferSchemaType } from "mongoose";
import { itemSchema } from "./product.model";

const orderListSchema = new mongoose.Schema({
	buyerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	item: {
		type: itemSchema,
	},
});

const purchaseItemsSchema = new mongoose.Schema({
	item: itemSchema,
	sellerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "completed", "cancelled"],
		default: "pending",
	},
});

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
			type: [orderListSchema],
		},
		purchaseItems: [purchaseItemsSchema],
		userProducts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{
		timestamps: true, //jika true, maka saaat memasukan data kedalam db akan ada satu data tambahan yaitu data tanggal
	},
);

// gunakan skema dari mongoose sebagai type ts
export type UserSchema = InferSchemaType<typeof userSchema>;
export type PurchaseItem = InferSchemaType<typeof purchaseItemsSchema>;
export type OrderList = InferSchemaType<typeof orderListSchema>;

const User = mongoose.model("User", userSchema);

export default User;

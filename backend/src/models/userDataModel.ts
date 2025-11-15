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

const userDataSchema = new mongoose.Schema(
	{
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
export type UserDataType = InferSchemaType<typeof userDataSchema>;
export type PurchaseItem = InferSchemaType<typeof purchaseItemsSchema>;
export type OrderList = InferSchemaType<typeof orderListSchema>;

/*
Pertama	Nama Model	Nama yang digunakan di sisi kode (UserData).
Kedua	Skema	Objek yang mendefinisikan struktur data (userDataSchema).
Ketiga	Nama Koleksi	Menimpa aturan penamaan otomatis Mongoose.
*/

const UserData = mongoose.model("UserData", userDataSchema, "userData");

export default UserData;

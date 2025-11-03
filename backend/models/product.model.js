import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		imageName: {
			type: String,
			required: true,
		},
		ISBN: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		tags: Array,
	},
	{
		timestamps: true, //jika true, maka saaat memasukan data kedalam db akan ada satu data tambahan yaitu data tanggal
	},
);

const Product = mongoose.model("Product", itemSchema);

export default Product;

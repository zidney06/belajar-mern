import mongoose from "mongoose";

export const skemaBarang = new mongoose.Schema(
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
		tags: Array,
		ownerId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, //jika true, maka saaat memasukan data kedalam db akan ada satu data tambahan yaitu data tanggal
	}
);

const Product = mongoose.model("Product", skemaBarang);

export default Product;

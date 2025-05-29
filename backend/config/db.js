import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`mongoose connected: ${conn.connection.host}`);
	} catch (e) {
		console.error(`Error message: ${e.message}`);
		process.exit(1);
	}
};

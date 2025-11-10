import mongoose from "mongoose";

function isError(error: any): error is { message: string } {
	return error && typeof error === "object" && "message" in error;
}

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI!);
		console.log(`mongoose connected: ${conn.connection.host}`);
	} catch (e) {
		if (isError(e)) {
			console.error(`Error message: ${e.message}`);
			process.exit(1);
		}
	}
};

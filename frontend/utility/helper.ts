interface ValidationParams {
	title: string;
	author: string;
	price: number | string;
	ISBN: string;
	imagePreview: string;
	tags: string[];
}

interface ReturnType {
	status: boolean;
	msg: string | string[];
}

export const validation: (product: ValidationParams) => ReturnType = (
	product,
) => {
	let messages = [];

	if (!product.title.trim()) {
		messages.push("title kosong");
	}
	if (!product.author.trim()) {
		messages.push("author kosong");
	}
	if (!product.price) {
		messages.push("price tidak valid"); // Perbaikan validasi price
	}
	if (!product.ISBN.trim()) {
		messages.push("ISBN kosong");
	}
	if (!product.imagePreview) {
		messages.push("image kosong");
	}

	if (messages.length > 0) {
		return { status: false, msg: messages.join(", ") };
	}
	return { status: true, msg: "berhasil" };
};

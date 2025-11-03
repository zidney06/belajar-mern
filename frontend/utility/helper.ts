interface ValidationParams {
	title: string;
	author: string;
	price: number | string;
	ISBN: string;
	imagePreview: string;
	tags: string[];
}

export const validation: (product: ValidationParams) => boolean = (
	product: ValidationParams,
) => {
	let messages = [];

	if (!product.title) {
		messages.push("title kosong");
	}
	if (!product.author) {
		messages.push("auhtor kosong");
	}
	if (!product.price) {
		messages.push("price tidak valid"); // Perbaikan validasi price
	}
	if (!product.ISBN) {
		messages.push("ISBN kosong");
	}
	if (!product.imagePreview) {
		messages.push("image kosong");
	}

	if (messages.length > 0) {
		alert("Terdapat error yaitu: " + messages);
		return false;
	}
	return true;
};

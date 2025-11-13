import { useContext } from "react";
import { postFetch } from "../../utility/fetch.ts";
import MyContext from "../context/MyContext.ts";
import { isAxiosError } from "axios";

interface ProductListProps {
	header: string;
	tag: string;
	products: Product[];
}

interface Product {
	_id: string;
	author: string;
	title: string;
	price: number;
	imageUrl: string;
	tags: string[];
}

export default function ProductList({
	header,
	tag,
	products,
}: ProductListProps) {
	const popup = useContext(MyContext);

	const filteredBooks = products.filter((product) =>
		product.tags.some((el) => el === tag),
	);
	const hndlConfirm = (product: Product) => {
		if (
			confirm(
				`Apakah anda yakin akan membeli ${product.title} seharga ${product.price}`,
			)
		) {
			postFetch("/product/buy-product", {
				productId: product._id,
			}).then((res) => {
				if (!res.success) {
					if (isAxiosError(res.err)) {
						res.err.response &&
							popup({
								isShow: true,
								title: "Oops!",
								message: res.err.response.data.msg,
							});
					} else {
						// Error non-Axios lainnya
						popup({
							isShow: true,
							title: "Oops!",
							message: "Terjadi kesalahan saat memproses login.",
						});
					}
					return;
				}
				alert("Permintaan berhasil dikirim");
			});
		}
	};

	return (
		<div className="my-3 border rounded p-1">
			<h4>{header}</h4>
			<div className="container-fluid d-flex overflow-auto p-2">
				{filteredBooks.length === 0
					? `Barang dengan kategori ${header} kosong`
					: filteredBooks.map((book, i) => (
							<div className="card dev-card mx-1" key={i}>
								<img
									src={book.imageUrl}
									className="card-img-top"
									alt="..."
									style={{ height: 150 }}
								/>
								<div className="card-body p-2 position-relative">
									<h5 className="card-title">{book.title}</h5>
									<p className="mb-0">Author: {book.author}</p>
									<p className="mb-0">Price: {book.price}</p>
									<p className="mb-0">tags: {book.tags.join(", ")}</p>
									<div className="d-flex justify-content-between p-2 mt-2">
										<button
											className="btn btn-primary"
											onClick={() => hndlConfirm(book)}
										>
											Beli
										</button>
									</div>
								</div>
							</div>
						))}
			</div>
		</div>
	);
}

import { postFetch } from "../../utility/fetch.jsx";

import { useEffect, useState, type JSX } from "react";

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
	const filteredBooks = products.filter((product) =>
		product.tags.some((el) => el === tag),
	);
	const hndlConfirm = (product: Product) => {
		if (
			confirm(
				`Apakah anda yakin akan membeli ${product.title} seharga ${product.price}`,
			)
		) {
			postFetch("/product/buy-product/" + product._id).then((res) => {
				if (!res.success) {
					if (res.status == 401) {
						alert("Login dulu");
						return;
					}
					return alert(res.response.data.msg);
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
									<p className="mb-0">tags: {book.tags}</p>
									<div className="d-flex justify-content-betweenp-2 mt-2">
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

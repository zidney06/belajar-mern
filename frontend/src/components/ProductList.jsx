import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSelector } from "react-redux";
import { postFetch } from "../../utility/fetch";

export default function ProductList({ header, tag }) {
	const products = useSelector((state) => state.products.value);

	const filteredBooks = products.filter((product) =>
		product.tags.some((el) => el === tag)
	);
	const hndlConfirm = (product) => {
		if (
			confirm(
				`Apakah anda yakin akan membeli ${product.title} seharga ${product.price}`
			)
		) {
			postFetch("/product/buy-product", product).then((res) => {
				if (!res.success) {
					if (res.response.data.message == "Unauthorized") {
						alert("Login dulu");
					} else {
						alert("Gagal membeli produk");
					}
					return;
				}

				alert("Permintaan berhasil dikirim");
			});
		}
	};

	if (!tag) {
		return (
			<div className="my-3 border rounded p-1">
				<h4>Produk tersedia</h4>
				<div className="container-fluid d-flex overflow-auto p-2">
					{products.length === 0
						? `Barang dengan kategori ini kosong`
						: products.map((book, i) => (
								<div className="card dev-card mx-1" key={i}>
									<img
										src={book.imageUrl}
										className="card-img-top"
										alt="..."
										style={{ height: 150 }}
									/>
									<div className="card-body p-1">
										<h5 className="card-title">{book.title}</h5>
										<p>Author: {book.author}</p>
										<p>Price: {book.price}</p>
										<p>tags: {book.tags}</p>
										<button
											className="btn btn-primary"
											onClick={() => hndlConfirm(book)}
										>
											Beli
										</button>
									</div>
								</div>
						  ))}
				</div>
			</div>
		);
	}

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
								<div className="card-body p-1">
									<h5 className="card-title">{book.title}</h5>
									<p>Author: {book.author}</p>
									<p>Price: {book.price}</p>
									<p>tags: {book.tags}</p>
									<button
										className="btn btn-primary"
										onClick={() => hndlConfirm(book)}
									>
										Beli
									</button>
								</div>
							</div>
					  ))}
			</div>
		</div>
	);
}

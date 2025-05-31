import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { addProduct, delProduct, editProduct } from "../../slices/productSlice";
import { getFetch, postFetch, putfetch, delFetch } from "../../utility/fetch";
import {
	setUser,
	setUserProducts,
	delUserProduct,
	addUserProduct,
	editUserProduct,
} from "../../slices/userSlice";

export default function CreatePage() {
	const dispatch = useDispatch();
	const { data, products } = useSelector((state) => state.user.value);
	const [orderList, setOrderList] = useState([]);

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [price, setPrice] = useState(0);
	const [ISBN, setISBN] = useState("");
	const image = useRef(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [imageName, setImageName] = useState(null);
	const [tags, setTags] = useState([]);
	const [isEdit, setIsEdit] = useState(false);
	const [productId, setProductId] = useState(null);

	useEffect(() => {
		getFetch("/user/user-product").then((res) => {
			if (!res.success) {
				dispatch(setUser(null));
				dispatch(setUserProducts([]));
				sessionStorage.removeItem("token");
				return;
			}

			console.log(res);
			dispatch(setUserProducts(res.data.products));
			console.log(res.data.orderList);
			setOrderList(res.data.orderList);
		});
	}, []);

	const validation = () => {
		let messages = [];
		const parsedPrice = parseInt(price);

		if (!title) {
			messages.push("title kosong");
		}
		if (!author) {
			messages.push("auhtor kosong");
		}
		if (!parsedPrice || typeof parsedPrice != "number") {
			messages.push("price tidak valid"); // Perbaikan validasi price
		}
		if (!ISBN) {
			messages.push("ISBN kosong");
		}
		if (!imagePreview) {
			messages.push("image kosong");
		}

		if (messages.length > 0) {
			alert("Terdapat error yaitu: " + messages);
			return false;
		}
		return true;
	};

	const hndlTitle = (e) => {
		setTitle(e.target.value);
	};

	const hndlAuthor = (e) => {
		setAuthor(e.target.value);
	};

	const hndlPrice = (e) => {
		/*masalahnya tedapat pada fitur dari laptop yaitu ketika menggulir 
    mouse kebawah maka value dari input type number akan berkurangg, jika digulir ke atas
    value type number bertambah*/
		setPrice(e.target.value);
	};

	const hndlISBN = (e) => {
		setISBN(e.target.value);
	};

	const hndlImage = () => {
		const file = image.current.files[0];
		const imageUrl = URL.createObjectURL(file);

		if (file) {
			setImagePreview(URL.createObjectURL(file));
		} else {
			setImagePreview(null);
		}
	};

	const hndlConfirm = () => {
		if (!validation()) {
			return;
		}

		const formData = new FormData();

		if (isEdit) {
			if (image.current.files.length != 0) {
				formData.append("file", image.current.files[0]);
			}

			formData.append(
				"data",
				JSON.stringify({
					_id: productId,
					title,
					author,
					price,
					ISBN,
					imageName: imageName,
					tags,
					ownerId: data._id,
				})
			);

			putfetch(`/product/${id}`, formData).then((res) => {
				if (!res.success) {
					alert(res.response.data, message);
					return;
				}

				console.log(res.data);
				// mengubah global state untuk products
				dispatch(editProduct(res.data.data));
				// mengubah state untuk product user
				dispatch(editUserProduct(res.data.data));

				setIsEdit(false);
				resetValue();
			});
		} else {
			formData.append(
				"data",
				JSON.stringify({
					title,
					author,
					price,
					ISBN,
					imageUrl: "",
					tags,
					ownerId: data._id,
				})
			);
			formData.append("file", image.current.files[0]);

			postFetch("/product", formData).then((res) => {
				if (!res.success) {
					alert(res.response.data.message);

					return;
				}

				console.log(res.data.data);
				// mengubah global state untuk products
				dispatch(addProduct(res.data.data));
				// mengubah state untuk product user
				dispatch(addUserProduct(res.data.data));

				resetValue();
			});
		}
	};
	const hndlChangeTag = (e) => {
		const { value, checked } = e.target;

		if (checked) {
			setTags((prev) => [...prev, value]);
		} else {
			setTags((prev) => prev.filter((item) => item !== value));
		}
	};
	const hndlDelete = (index, id) => {
		if (confirm("Apakah yakin ingin dihapus?")) {
			delFetch(`/product/${id}`).then((res) => {
				if (!res.success) {
					alert("Gagal menghapus");

					return;
				}

				dispatch(delProduct({ id: id }));
				dispatch(delUserProduct({ index: index }));
			});
		}
	};
	const hndlEdit = (product) => {
		setTitle(product.title);
		setAuthor(product.author);
		setPrice(product.price);
		setISBN(product.ISBN);
		setImagePreview(product.imageUrl);
		setImageName(product.imageName);
		setTags(product.tags);
		setIsEdit(true);
		setProductId(product._id);
	};
	const resetValue = () => {
		setProductId(null);
		setTitle("");
		setAuthor("");
		setPrice(0);
		setISBN("");
		image.current.files = null;
		image.current.value = null;
		setImagePreview(null);
		setImageName(null);
		setTags([]);
		setIsEdit(false);
	};

	const hndlRespons = (respons, index) => {
		console.log("res");
		postFetch("/user/respons", { respons: respons, index: index }).then(
			(res) => {
				if (!res.success) {
					console.log("res 3");
					return;
				}

				console.log("2");
				setOrderList(
					orderList.filter((item, i) => {
						if (i === index) {
							return;
						}

						return item;
					})
				);

				if (respons) {
					alert("Permintaan diterima");
				} else {
					alert("Permintaan ditolak");
				}
			}
		);
	};

	console.log(orderList);

	if (products.length == 0 && !data) {
		return (
			<div className="container-fluid p-0 my-5 d-flex justify-content-center align-items-center dev-container">
				<div className="w-75 border border-2 border-info rounded p-3">
					<h1 className="text-center">Harap Login Terlebih Dahulu</h1>
					<Link
						to="/login"
						className="btn btn-outline-primary mx-auto d-block w-25"
					>
						Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid p-0 my-5">
			<div className="dev-input-box mx-auto border border-info rounded border-2 px-2">
				<h1 className="text-center">{isEdit ? "Edit Data" : "Input Data"}</h1>
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						value={title}
						type="text"
						className="form-control"
						id="title"
						placeholder="Title"
						autoComplete="off"
						onChange={hndlTitle}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="Author" className="form-label">
						Author
					</label>
					<input
						value={author}
						type="text"
						className="form-control"
						id="Author"
						placeholder="Author"
						autoComplete="off"
						onChange={hndlAuthor}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="Price" className="form-label">
						Price
					</label>
					<input
						value={price}
						type="number"
						className="form-control"
						id="Price"
						autoComplete="off"
						onChange={hndlPrice}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="ISBN" className="form-label">
						ISBN
					</label>
					<input
						value={ISBN}
						type="text"
						className="form-control"
						id="ISBN"
						placeholder="000-000-000"
						autoComplete="off"
						onChange={hndlISBN}
					/>
				</div>
				{/*bagian image nanti diubah menjadi input type file*/}
				<div>
					{imagePreview && (
						<img
							src={imagePreview}
							alt="Preview"
							style={{ width: 200, height: 150 }}
						/>
					)}
					<div className="mb-3">
						<label htmlFor="Image" className="form-label">
							Image
						</label>
						<input
							ref={image}
							type="file"
							className="form-control"
							id="Image"
							onChange={hndlImage}
						/>
					</div>
				</div>

				{/*tipe buku*/}
				<p className="text-center">Pilih tipe buku</p>
				<div className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						value="komik"
						id="komik"
						checked={tags.includes("komik")}
						onChange={hndlChangeTag}
					/>
					<label className="form-check-label" htmlFor="komik">
						Komik
					</label>
				</div>
				<div className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						value="majalah"
						id="majalah"
						checked={tags.includes("majalah")}
						onChange={hndlChangeTag}
					/>
					<label className="form-check-label" htmlFor="majalah">
						Majalah
					</label>
				</div>
				<div className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						value="buku"
						id="buku"
						checked={tags.includes("buku")}
						onChange={hndlChangeTag}
					/>
					<label className="form-check-label" htmlFor="buku">
						Buku
					</label>
				</div>
				<div className="my-3 d-flex justify-content-between">
					<button className="btn btn-outline-danger" onClick={resetValue}>
						Hapus Input
					</button>
					<button className="btn btn-outline-primary" onClick={hndlConfirm}>
						Konfirmasi
					</button>
				</div>
			</div>
			<div className="my-3 border rounded p-1">
				<h4>Daftar Buku Tersedia</h4>
				<div className="container-fluid d-flex overflow-auto p-2">
					{products.map((product, i) => (
						<div className="card dev-card mx-1" key={i}>
							<img
								src={product.imageUrl}
								className="card-img-top"
								alt="..."
								style={{ height: 150 }}
							/>
							<div className="card-body p-1">
								<h5 className="card-title">{product.title}</h5>
								<p>Author: {product.author}</p>
								<p>Price: {product.price}</p>
								<p>tags: {product.tags}</p>
								<div className="d-flex justify-content-between">
									<button
										className="btn btn-outline-danger"
										onClick={() => hndlDelete(i, product._id)}
									>
										Hapus
									</button>
									<button
										className="btn btn-outline-primary"
										onClick={() => hndlEdit(product)}
									>
										Edit
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="my-3 border rounded p-1">
				<h4>Daftar permintaan pembelian</h4>
				<div className="container-fluid d-flex overflow-auto p-2">
					{orderList.map((product, i) => (
						<div className="card dev-card mx-1" key={i}>
							<div className="card-body p-1">
								<h5 className="card-title">{product.title}</h5>
								{/* aku masih bingung logic membeli barang mau dibikim gimana */}
								<div className="d-flex justify-content-between">
									<button
										className="btn btn-danger"
										onClick={() => hndlRespons(false, i)}
									>
										Tolak
									</button>
									<button
										className="btn btn-info"
										onClick={() => hndlRespons(true, i)}
									>
										Terima
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

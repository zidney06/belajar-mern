import {
	useState,
	useRef,
	useEffect,
	type KeyboardEvent,
	type ChangeEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	addProduct,
	delProduct,
	editProduct,
} from "../../slices/productSlice.ts";
import {
	getFetch,
	postFetch,
	putfetch,
	delFetch,
} from "../../utility/fetch.ts";
import {
	setUser,
	setUserProducts,
	delUserProduct,
	addUserProduct,
	editUserProduct,
} from "../../slices/userSlice.ts";
import { validation } from "../../utility/helper.ts";
import type { RootState } from "../../store/store.tsx";
import { isAxiosError } from "axios";

export default function CreatePage() {
	const dispatch = useDispatch();
	const { products, data } = useSelector(
		(state: RootState) => state.user.value,
	);
	const [orderList, setOrderList] = useState([]);

	const [username, setUsername] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [author, setAuthor] = useState<string>("");
	const [price, setPrice] = useState<number | string>("");
	const [ISBN, setISBN] = useState<string>("");
	const image = useRef<HTMLInputElement>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [imageName, setImageName] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [productId, setProductId] = useState<string>("");

	useEffect(() => {
		getFetch("/user/user-product").then((res) => {
			if (!res.success) {
				dispatch(
					setUser({
						_id: "",
						username: "",
						email: "",
					}),
				);
				dispatch(setUserProducts([]));
				sessionStorage.removeItem("token");
				alert("terjadi kesalahan");
				return;
			}

			setUsername(res.data.username);
			dispatch(setUserProducts(res.data.products));
			console.log(res.data.orderList);
			setOrderList(res.data.orderList);
		});
	}, []);

	const hndlTitle = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const hndlAuthor = (e: ChangeEvent<HTMLInputElement>) => {
		setAuthor(e.target.value);
	};

	const blockInvalidChar = (event: KeyboardEvent<HTMLInputElement>) => {
		// Array karakter yang ingin diblokir
		const blockedChars = ["e", "E", "+", "-"];

		// Memeriksa apakah tombol yang ditekan ada dalam daftar blokir
		if (blockedChars.includes(event.key)) {
			event.preventDefault(); // Mencegah aksi default (memasukkan karakter ke input)
		}
	};
	const hndlPrice = (e: ChangeEvent<HTMLInputElement>) => {
		/*masalahnya tedapat pada fitur dari laptop yaitu ketika menggulir
    mouse kebawah maka value dari input type number akan berkurangg, jika digulir ke atas
    value type number bertambah*/

		setPrice(e.target.value);
	};

	const hndlISBN = (e: ChangeEvent<HTMLInputElement>) => {
		setISBN(e.target.value);
	};

	const hndlImage = () => {
		if (image.current && image.current.files) {
			const file = image.current.files[0];

			if (file) {
				setImagePreview(URL.createObjectURL(file));
			} else {
				setImagePreview("");
			}
		}
	};
	const hndlConfirmEdit = () => {
		let route = "/product/update-without-file/" + productId;

		if (
			!validation({
				title,
				author,
				price,
				ISBN,
				tags,
				imagePreview,
			})
		) {
			return;
		}

		const selectedFile = image.current?.files?.[0];

		const formData = new FormData();

		if (selectedFile) {
			formData.append("file", selectedFile);
			route = "/product/update-with-file/" + productId;
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
			}),
		);

		putfetch(route, formData).then((res) => {
			if (!res.success) {
				if (isAxiosError(res.err)) {
					// Cek jika ada response dari server (status 4xx/5xx)
					if (res.err.response) {
						// ✅ Akses aman: res.err.response.data.message
						alert(res.err.response.data.msg);
					} else {
						// Network Error murni atau Timeout
						alert("Kesalahan Jaringan. Cek koneksi Anda.");
					}
				} else {
					// Error non-Axios lainnya
					alert("Terjadi kesalahan saat memproses login.");
				}

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
	};
	const hndlConfirmAdd = () => {
		if (
			!validation({
				title,
				author,
				price,
				ISBN,
				tags,
				imagePreview,
			})
		) {
			return;
		}

		const selectedFile = image.current?.files?.[0];

		const formData = new FormData();

		if (selectedFile) {
			formData.append(
				"data",
				JSON.stringify({
					title,
					author,
					price,
					ISBN,
					imageUrl: "",
					tags,
				}),
			);
			formData.append("file", selectedFile);
		}

		postFetch("/product", formData).then((res) => {
			if (!res.success) {
				if (isAxiosError(res.err)) {
					// Cek jika ada response dari server (status 4xx/5xx)
					if (res.err.response) {
						// ✅ Akses aman: res.err.response.data.message
						alert(res.err.response.data.msg);
					} else {
						// Network Error murni atau Timeout
						alert("Kesalahan Jaringan. Cek koneksi Anda.");
					}
				} else {
					// Error non-Axios lainnya
					alert("Terjadi kesalahan saat memproses login.");
				}

				return;
			}

			console.log(res.data.data);
			// mengubah global state untuk products
			dispatch(addProduct(res.data.data));
			// mengubah state untuk product user
			dispatch(addUserProduct(res.data.data));

			resetValue();
		});
	};
	const hndlChangeTag = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;

		if (checked) {
			setTags((prev) => [...prev, value]);
		} else {
			setTags((prev) => prev.filter((item) => item !== value));
		}
	};
	const hndlDelete = (id: string) => {
		if (confirm("Apakah yakin ingin dihapus?")) {
			delFetch(`/product/${id}`).then((res) => {
				if (!res.success) {
					alert("Gagal menghapus");

					return;
				}

				dispatch(delProduct({ id }));
				dispatch(delUserProduct({ id }));
			});
		}
	};
	const hndlEdit = (product: {
		_id: string;
		title: string;
		author: string;
		price: number;
		imageUrl: string;
		ISBN: string;
		imageName: string;
		tags: string[];
	}) => {
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
		if (image.current && image.current.files) {
			setProductId("");
			setTitle("");
			setAuthor("");
			setPrice("");
			setISBN("");
			image.current.files = null;
			image.current.value = "";
			setImagePreview("");
			setImageName("");
			setTags([]);
			setIsEdit(false);
		}
	};

	const hndlRespons = (
		respons: boolean,
		checkout: {
			_id: string;
			buyerId: string;
			item: {
				_id: string;
				title: string;
				author: string;
				price: number;
				imageUrl: string;
				ISBN: string;
				imageName: string;
				tags: string[];
			};
		},
	) => {
		console.log(checkout);
		const data = {
			respons,
			product: checkout.item,
			buyerId: checkout.buyerId,
			orderId: checkout._id,
		};
		postFetch("/user/respons", data).then((res) => {
			if (!res.success) {
				return;
			}

			console.log(res);
			setOrderList((prev) =>
				prev.filter(
					(order: {
						_id: string;
						buyerId: string;
						item: {
							_id: string;
							title: string;
							author: string;
							price: number;
							imageUrl: string;
							ISBN: string;
							imageName: string;
							tags: string[];
						};
					}) => order._id !== res.data.data.orderId,
				),
			);
		});
	};

	console.log(orderList);

	if (!data._id) {
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
				<h4>Halo: {username}</h4>
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
						onKeyDown={blockInvalidChar}
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
					<button
						className="btn btn-outline-primary"
						onClick={isEdit ? hndlConfirmEdit : hndlConfirmAdd}
					>
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
							<div
								className="card-body p-1 position-relative"
								style={{ height: 200 }}
							>
								<h5 className="card-title">{product.title}</h5>
								<p className="mb-0">Author: {product.author}</p>
								<p className="mb-0">Price: {product.price}</p>
								<p className="mb-0">tags: {product.tags}</p>
								<div className="d-flex justify-content-between position-absolute bottom-0 end-0 start-0 p-2">
									<button
										className="btn btn-outline-danger"
										onClick={() => hndlDelete(product._id)}
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
					{orderList.map(
						(
							checkout: {
								_id: string;
								buyerId: string;
								item: {
									_id: string;
									title: string;
									author: string;
									price: number;
									imageUrl: string;
									ISBN: string;
									imageName: string;
									tags: string[];
								};
							},
							i,
						) => (
							<div className="card dev-card mx-1" key={i}>
								<div className="card-body p-1">
									<p className="card-title">
										Nama barang:
										{" " + checkout.item.title}
									</p>
									{/* aku masih bingung logic membeli barang mau dibikim gimana */}
									<div className="d-flex justify-content-between">
										<button
											className="btn btn-danger"
											onClick={() => hndlRespons(false, checkout)}
										>
											Tolak
										</button>
										<button
											className="btn btn-info"
											onClick={() => hndlRespons(true, checkout)}
										>
											Terima
										</button>
									</div>
								</div>
							</div>
						),
					)}
				</div>
			</div>
		</div>
	);
}

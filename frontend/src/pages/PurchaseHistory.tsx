import { useContext, useEffect, useState } from "react";
import { delFetch, getFetch } from "../../utility/fetch.ts";
import { useNavigate, Link } from "react-router-dom";
import MyContext from "../context/MyContext.ts";

interface Item {
	_id: string;
	title: string;
	author: string;
	imageUrl: string;
	imageName: string;
	ISBN: string;
	price: number | string;
	ownerId: string;
	tags: "buku" | "majalah" | "komik";
}

interface PurchaseHistory {
	_id: string;
	item: Item;
	sellerId: string;
	status: "pending" | "cancelled" | "completed";
}

export default function PurchaseHistory() {
	const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLogin, setIsLogin] = useState<boolean>(false);

	const navigate = useNavigate();
	const popup = useContext(MyContext);

	useEffect(() => {
		getDataFromBackend();
	}, []);

	const getDataFromBackend = async () => {
		setTimeout(async () => {
			const res = await getFetch("/user/purchase-history");

			if (!res.success) {
				setPurchaseHistory([]);

				setIsLogin(false);
				setIsLoading(false);
				popup({
					isShow: true,
					title: "Oops!",
					message: "Gagal mengambil informasi pembelian",
				});
				return;
			}

			setPurchaseHistory(res.data.data);

			setIsLoading(false);
			setIsLogin(true);
		}, 700);
	};

	const handleDelete = (purchaseId: string) => {
		delFetch("/product/purchase/" + purchaseId).then((res) => {
			if (!res.success) {
				if (res.status === 401) {
					alert("Harap login dulu");
					navigate("/login");
					return;
				}
				return alert("Gagal meghapus history");
			}

			setPurchaseHistory((prev) =>
				prev.filter((history) => history._id !== res.data.data),
			);
		});
	};

	if (isLoading) {
		return (
			<div className="container-fluid p-0 my-5 d-flex justify-content-center align-items-center dev-container">
				<div className="w-75 border border-2 border-info rounded p-3">
					<h1 className="text-center loading-text">
						Loading
						<span className="dot-1">.</span>
						<span className="dot-2">.</span>
						<span className="dot-3">.</span>
					</h1>
				</div>
			</div>
		);
	}

	if (!isLogin) {
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

	if (purchaseHistory.length === 0) {
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
		<div className="container-fluid" style={{ minHeight: "80vh" }}>
			<h2>Purchase History</h2>

			<div className="p-2 rounded border border-2 border d-flex overflow-auto">
				{purchaseHistory.length > 0 ? (
					purchaseHistory.map((history, i) => {
						return (
							<div key={i} className="card p-3 dev-card border border mx-1">
								<p>{"Nama barang: " + history.item.title}</p>
								<p>{"Harga: " + history.item.price}</p>
								<p>{"Status: " + history.status}</p>

								<button
									className="btn btn-danger"
									onClick={() => handleDelete(history._id)}
								>
									Hapus
								</button>
							</div>
						);
					})
				) : (
					<div className="p-2 rounded border border-2 border mx-auto">
						<h4 className="text-center mb-0">Tidak ada riwayat pembelian</h4>
					</div>
				)}
			</div>
		</div>
	);
}

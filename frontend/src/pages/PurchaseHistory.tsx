import { useEffect, useState } from "react";
import { delFetch, getFetch } from "../../utility/fetch.ts";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();

	useEffect(() => {
		if (!sessionStorage.getItem("token")) {
			navigate("/login");
			return;
		}
		getFetch("/user/purchase-history").then((res) => {
			if (!res.success) {
				if (res.status === 401) {
					alert("Harap login dulu");
					navigate("/login");
					return;
				}
				alert("Gagal mengambl data");
				navigate("/login");
				return;
			}

			console.log(res);
			setPurchaseHistory(res.data.data);
		});
	}, []);

	const handleDelete = (purchaseId: string) => {
		console.log(purchaseId);
		delFetch("/product/" + purchaseId).then((res) => {
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
			console.log(res);
		});
	};

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

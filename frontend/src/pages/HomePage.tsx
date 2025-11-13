import { getFetch } from "../../utility/fetch.ts";
import ProductList from "../components/ProductList.tsx";
import { useContext, useEffect, useState } from "react";
import PopupContext from "../context/MyContext.ts";
import { isAxiosError } from "axios";

interface Product {
	_id: string;
	title: string;
	price: number;
	author: string;
	imageUrl: string;
	tags: string[];
}

export default function HomePage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const popup = useContext(PopupContext);

	useEffect(() => {
		getDataFromBackend();
	}, []);

	const getDataFromBackend = async () => {
		setTimeout(async () => {
			const res = await getFetch("/product");
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
				setIsLoading(false);
				return;
			}
			setProducts(res.data.data);
			setIsLoading(false);
		}, 700);
	};

	// console.log(popup);

	return (
		<div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
			<div className="w-75 mx-auto my-5">
				<h2 className="text-center">
					<i>Digital Shop Al-Hidayah</i>
				</h2>
			</div>
			<main className="px-2">
				{isLoading ? (
					<h1 className="text-center loading-text">
						Loading
						<span className="dot-1">.</span>
						<span className="dot-2">.</span>
						<span className="dot-3">.</span>
					</h1>
				) : (
					<div>
						<ProductList header="Komik" tag="komik" products={products} />
						<ProductList header="Majalah" tag="majalah" products={products} />
						<ProductList header="Buku" tag="buku" products={products} />
					</div>
				)}
			</main>
		</div>
	);
}

import { getFetch } from "../../utility/fetch.jsx";
import ProductList from "../components/ProductList.tsx";
import { useEffect, useState } from "react";

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

	useEffect(() => {
		getFetch("/product").then((res) => {
			if (!res.success) {
				return alert("Gagal mengambil data produk");
			}
			setProducts(res.data.data);
		});
	}, []);

	console.log(products);

	return (
		<div className="container-fluid p-0">
			<div className="w-75 mx-auto my-5">
				<h2 className="text-center">Selamat Datang</h2>
			</div>
			<main className="px-2">
				<ProductList header="Komik" tag="komik" products={products} />
				<ProductList header="Majalah" tag="majalah" products={products} />
				<ProductList header="Buku" tag="buku" products={products} />
			</main>
		</div>
	);
}

import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import CreatePage from "./pages/CreatePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import PurchaseHistory from "./pages/PurchaseHistory.tsx";
import "./styles/style.css";
import { useEffect, useState } from "react";
import { setInitial } from "../slices/productSlice.ts";
import { useDispatch } from "react-redux";
import { getFetch } from "../utility/fetch.ts";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		getFetch("/product").then((res) => {
			if (!res.success) {
				return;
			}

			dispatch(setInitial(res.data.data));
			console.log(res.data.data);
		});
	}, []);

	console.log("app");

	return (
		<>
			<Navbar />
			<div className="pb-5">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/create" element={<CreatePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/purchase-history" element={<PurchaseHistory />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>

			<Footer />
		</>
	);
}

export default App;

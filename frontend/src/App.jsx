import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import LoginPage from "./pages/LoginPage";
import BuyProductPage from "./pages/BuyProductPage";
import NotFound from "./pages/NotFound";
import "./styles/style.css";
import { useEffect, useState } from "react";
import { setInitial } from "../slices/productSlice";
import { useDispatch } from "react-redux";
import { getFetch } from "../utility/fetch";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/create" element={<CreatePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/buy/:productId" element={<BuyProductPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
			<Footer />
		</>
	);
}

export default App;

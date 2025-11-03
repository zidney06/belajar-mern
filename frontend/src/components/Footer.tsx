import { FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-primary container-fluid text-light row p-3 m-0 red">
			<div className="col text-center mb-0">
				<h3 className="mb-0">
					<FaInstagram />
					@Toko Al-Hidayah
				</h3>
			</div>
			<div className="col text-center">
				<h3 className="mb-0">
					<FaYoutube />
					@Toko Al-Hidayah
				</h3>
			</div>
		</footer>
	);
}

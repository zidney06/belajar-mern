import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
	const [cheked, setCheked] = useState(false);

	return (
		<div className="container-fluid px-0 bg-primary text-light row mx-0">
			<div
				className="row container-fluid col-11 px-0 mx-0"
				style={{ width: "100%" }}
			>
				<div className="navbar bg-primary p-2" data-bs-theme="dark">
					<h3 className="navbar-brand text-light">Toko Al-Hidayah</h3>
					<button
						className="navbar-toggler "
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<Link to="/" className="text-light link">
									Dashboard
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/create" className="nav-item text-light link">
									Account
								</Link>
							</li>
							<li className="nav-item">
								<Link
									to="/purchase-history"
									className="nav-item text-light link"
								>
									Riwayat Pembelian
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/login" className="nav-item text-light link">
									Login/Logout
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

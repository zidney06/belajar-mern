import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<div className="container-fluid px-0 bg-primary text-light row mx-0">
			<div
				className="row container-fluid col-11 px-0 mx-0"
				style={{ width: "100%" }}
			>
				<div
					className="navbar navbar-expand bg-primary p-2"
					data-bs-theme="dark"
				>
					<div className="container-fluid d-flex">
						<div className="">
							<h1 className="navbar-brand ms-2 text-light">Toko Al-Hidayah</h1>
							<ul className="navbar-nav mb-2 mb-lg-0">
								<li className="nav-item mx-2">
									<Link to="/" className="text-light link">
										Main
									</Link>
								</li>
								<li className="nav-item mx-2">
									<Link to="/create" className="nav-item text-light link">
										Dashboard
									</Link>
								</li>
								<li className="nav-item mx-2">
									<Link to="/purchase-history" className="text-light link">
										History
									</Link>
								</li>
								<li className="nav-item mx-2">
									<Link to="/login" className="text-light link">
										Login/Logout
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

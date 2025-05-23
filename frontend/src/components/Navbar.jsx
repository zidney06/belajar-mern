import {Link} from 'react-router-dom'
import {useState} from 'react'
import {CiSearch} from 'react-icons/ci'
import {GiHamburgerMenu} from 'react-icons/gi'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function Navbar() {
	const [cheked, setCheked] = useState(false)

	return (
	<div className="container-fluid px-0 bg-primary text-light row mx-0">
		<button className="btn text-light col" data-bs-toggle="collapse" href="#tes">
			<GiHamburgerMenu />
		</button>
		<div className="row container-fluid col-11 px-0 mx-0">
			<div className="col-sm-12 col-md-6 col-7">
				<h3 className="my-1">Toko Al-Hidayah</h3>
			</div>
			<div className="col d-flex p-0">
				<input type="search" className="search form-control my-auto" placeholder="Search" autoComplete="off" />
				<button className="btn text-light fs-4 lh-base">
					<CiSearch className="search-icon" />
				</button>
			</div>
		</div>
		<div className="collapse" id="tes">
			<Link to="/" className="text-light link">Dashboard</Link>
			<Link to="/create" className="text-light link">Account</Link>
			<Link to="/login" className="text-light link">Login/Logout</Link>
		</div>
	</div>
	)
}
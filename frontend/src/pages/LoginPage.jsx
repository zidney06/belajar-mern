import {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function LoginPage() {
	const [isRegister, setIsRegister] = useState(true)

	/*
	setelah user berhasil login atau registrasi, data nya disimpan
	kedalam sebuah state dan redirect ke dashboard.

	nanti akan ditambahkan fitur cookies dan session untuk mengecek
	apakah user sudah pernah login atau belum
	*/

  return (
  <div className="container-fluid d-flex">
  	<div className="border border-2 border-info rounded w-75 mx-auto form text-center mt-5 p-1">
  		<h3>{isRegister ? "Registrasi" : "Login"}</h3>
  		<label className="form-label" htmlFor="username">username</label>
  		<input type="text" id="username" className="form-control form-control-sm" autoComplete="off" />
  		<label className="form-label" htmlFor="email">email</label>
  		<input type="email" id="email" className="form-control form-control-sm" autoComplete="off" />
  		<label className="form-label" htmlFor="password">password</label>
  		<input type="password" id="password" className="form-control form-control-sm" autoComplete="off" />
  		<div className="d-flex justify-content-between px-3 my-1">
  			<button className="btn btn-outline-warning" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Login" : "Register"}</button>
  			<button className="btn btn-outline-info">Submit</button>
  		</div>
  	</div>
  </div>
  )
}
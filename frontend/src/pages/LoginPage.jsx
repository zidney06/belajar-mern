import {useState, useRef} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {setValue, delValue} from '../../slices/userSlice'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function LoginPage() {
	const user = useSelector(state => state.user.value)
	const [isRegister, setIsRegister] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [message, setMessage] = useState('')
	const username = useRef('')
	const email = useRef('')
	const password = useRef('')

	const hndlSubmit = () => {
		if(isRegister){
			axios.post('http://localhost:3000/api/user/register',{
				username: username.current.value,
				email: email.current.value,
				password: password.current.value
			})
				.then(res => {
					console.log(res.data)
				})
				.catch(err => {
					alert(err.response.data.message)
				})
		} else {
			axios.post('http://localhost:3000/api/user/login',{
				email: email.current.value,
				password: password.current.value
			}, {withCredentials: true})
				.then(res => {
					console.log(res.data.data._id)
					dispatch(setValue(res.data.data))
					navigate('/')
				})
				.catch(err => {
					alert(err.response.data.message)
				})
		}
	}
	const hndlLogout = () => {
		axios.post('http://localhost:3000/api/user/logout',{}, {withCredentials: true})
			.then(res => {
				console.log(res.data)
			})
			.catch(err => {
				console.log(err)
			})
		dispatch(delValue())
	}

	

  return (
  <div className="container-fluid d-flex auth-box">
  	<div className="border border-2 border-info rounded w-75 mx-auto form text-center my-5 p-1">
  		<h3>{isRegister ? "Registrasi" : "Login"}</h3>
  		{isRegister && (
  		<>
	  		<label className="form-label" htmlFor="username">username</label>
	  		<input type="text" id="username" ref={username} className="form-control form-control-sm" autoComplete="off" />
  		</>
  		)}
  		<label className="form-label" htmlFor="email">email</label>
  		<input type="email" id="email" ref={email} className="form-control form-control-sm" />
  		<label className="form-label" htmlFor="password">password</label>
  		<input type="password" id="password" ref={password} className="form-control form-control-sm" />
  		<div className="d-flex justify-content-between px-3 my-1">
  			<button className="btn btn-outline-warning" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Login" : "Register"}</button>
  			<button className="btn btn-outline-info" onClick={hndlSubmit}>{isRegister ? "Submit" : "Login"}</button>
  			{(!isRegister && user) && (<button className="btn btn-outline-info" onClick={hndlLogout}>Logout</button>)}
  			
  		</div>
  	</div>
  </div>
  )
}
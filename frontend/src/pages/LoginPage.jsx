import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, delUser } from "../../slices/userSlice";
import { getFetch, postFetch } from "../../utility/fetch";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function LoginPage() {
	const { data: user, products } = useSelector((state) => state.user.value);
	const [isRegister, setIsRegister] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const username = useRef("");
	const email = useRef("");
	const password = useRef("");

	useEffect(() => {
		getFetch("http://localhost:3000/api/user/tes").then((res) => {
			if (!res.success) {
				dispatch(delUser());

				return;
			}

			console.log(res);
		});
	}, []);

	const hndlSubmit = () => {
		if (isRegister) {
			const data = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};

			postFetch("http://localhost:3000/api/user/register", data).then((res) => {
				if (!res.success) {
					alert(err.response.data.message);

					return;
				}
			});
		} else {
			const data = {
				email: email.current.value,
				password: password.current.value,
			};

			postFetch("http://localhost:3000/api/user/login", data).then((res) => {
				if (!res.success) {
					alert(res.response.data.message);

					return;
				}

				// simpan token di sessionStorage
				sessionStorage.setItem("token", res.data.token);

				dispatch(setUser(res.data.data));
				navigate("/");
			});
		}
	};
	const hndlLogout = () => {
		postFetch("http://localhost:3000/api/user/logout", {}).then((res) => {
			if (!res.success) {
				return;
			}

			dispatch(delUser());
			sessionStorage.removeItem("token");
		});
	};

	console.log(sessionStorage.getItem("token"));

	return (
		<div className="container-fluid d-flex dev-container">
			<div className="border border-2 border-info rounded w-50 mx-auto form text-center p-1 auth-box my-auto">
				<h3>{isRegister ? "Registrasi" : "Login"}</h3>
				{isRegister && (
					<>
						<label className="form-label" htmlFor="username">
							username
						</label>
						<input
							type="text"
							id="username"
							ref={username}
							className="form-control form-control-sm"
							autoComplete="off"
						/>
					</>
				)}
				<label className="form-label" htmlFor="email">
					email
				</label>
				<input
					type="email"
					id="email"
					ref={email}
					className="form-control form-control-sm"
				/>
				<label className="form-label" htmlFor="password">
					password
				</label>
				<input
					type="password"
					id="password"
					ref={password}
					className="form-control form-control-sm"
				/>
				<div className="d-flex justify-content-between px-3 my-1 my-2">
					<button
						className="btn btn-outline-warning"
						onClick={() => setIsRegister(!isRegister)}
					>
						{isRegister ? "Login" : "Register"}
					</button>
					<button className="btn btn-outline-info" onClick={hndlSubmit}>
						{isRegister ? "Submit" : "Login"}
					</button>
					{!isRegister && user && (
						<button className="btn btn-outline-info" onClick={hndlLogout}>
							Logout
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

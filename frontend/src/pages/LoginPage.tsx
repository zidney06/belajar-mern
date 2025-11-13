import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, delUser } from "../../slices/userSlice.ts";
import { getFetch, postFetch } from "../../utility/fetch.ts";
import MyContext from "../context/MyContext.ts";

export default function LoginPage() {
	const [isRegister, setIsRegister] = useState<boolean>(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const username = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [isLogin, setislogin] = useState<boolean>(false);
	const popup = useContext(MyContext);

	useEffect(() => {
		if (!localStorage.getItem("alhidayah-token")) {
			return;
		}
		getFetch("/user/user-info").then((res) => {
			if (!res.success) {
				return dispatch(delUser());
			}
			setislogin(res.data.isLogin);
		});
	}, []);

	const resetInput = () => {
		// type guard
		if (!username.current || !email.current || !password.current) {
			return;
		}

		username.current.value = "";
		email.current.value = "";
		password.current.value = "";
	};

	const hndlSubmit = () => {
		if (isRegister) {
			if (!username.current || !email.current || !password.current) {
				alert("Please fill all fields");
				popup({
					isShow: true,
					title: "Oops!",
					message: "Please fill all fields",
				});
				return;
			}
			const data = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};

			postFetch("/user/register", data).then((res) => {
				if (!res.success) {
					popup({
						isShow: true,
						title: "Oops!",
						message: "Gagal registrasi",
					});
					return;
				}
				popup({
					isShow: true,
					title: "Success!",
					message: "Berhasil registrasi",
				});
				resetInput();
			});
		} else {
			if (!email.current || !password.current) {
				alert("Please fill all fields");
				return;
			}
			const data = {
				email: email.current.value,
				password: password.current.value,
			};

			postFetch("/user/login", data).then((res) => {
				// 1. Kasus Gagal (res.success === false)
				if (!res.success) {
					popup({
						isShow: true,
						title: "Oops!",
						message: "Gagal login",
					});
					return;
				}

				localStorage.setItem("alhidayah-token", res.data.token);
				dispatch(setUser(res.data.data));
				navigate("/");
			});
		}
	};
	const hndlLogout = () => {
		postFetch("/user/logout", {}).then((res) => {
			if (!res.success) {
				popup({
					isShow: true,
					title: "Oops!",
					message: "Gagal logout",
				});
				return;
			}

			popup({
				isShow: true,
				title: "Success!",
				message: "Berhasil logout",
			});
			dispatch(delUser());
			setislogin(false);
			localStorage.removeItem("alhidayah-token");
		});
	};

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
					{!isRegister && isLogin && (
						<button className="btn btn-outline-info" onClick={hndlLogout}>
							Logout
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

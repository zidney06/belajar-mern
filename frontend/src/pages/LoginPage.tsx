import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, delUser } from "../../slices/userSlice.ts";
import { getFetch, postFetch } from "../../utility/fetch.ts";
import type { RootState } from "../../store/store.tsx";
import { isAxiosError } from "axios";

export default function LoginPage() {
	const { data } = useSelector((state: RootState) => state.user.value);
	const [isRegister, setIsRegister] = useState<boolean>(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const username = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [isLogin, setislogin] = useState<boolean>(false);

	useEffect(() => {
		getFetch("/user/user-info").then((res) => {
			if (!res.success) {
				dispatch(delUser());

				return;
			}

			console.log(res);
			setislogin(res.data.isLogin);
		});
	}, []);

	const resetInput = () => {
		if (!username.current || !email.current || !password.current) {
			alert("Please fill all fields");
			return;
		}

		username.current.value = "";
		email.current.value = "";
		password.current.value = "";
	};

	const hndlSubmit = () => {
		console.log(username.current, email.current, password.current);
		if (isRegister) {
			if (!username.current || !email.current || !password.current) {
				alert("Please fill all fields");
				return;
			}
			const data = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};

			postFetch("/user/register", data).then((res) => {
				// memastikan bahwa semua input itu bukan null
				if (!username.current || !email.current || !password.current) {
					return;
				}
				if (!res.success) {
					if (isAxiosError(res.err)) {
						// Cek jika ada response dari server (status 4xx/5xx)
						if (res.err.response) {
							// ✅ Akses aman: res.err.response.data.message
							alert(res.err.response.data.message);
						} else {
							// Network Error murni atau Timeout
							alert("Kesalahan Jaringan. Cek koneksi Anda.");
						}
					} else {
						// Error non-Axios lainnya
						alert("Terjadi kesalahan saat memproses login.");
					}

					return;
				}
				console.log("berhasil");
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
					// Cek jika error yang dibungkus adalah AxiosError
					// Asumsi: AxiosError disimpan di res.error
					if (isAxiosError(res.err)) {
						// Cek jika ada response dari server (status 4xx/5xx)
						if (res.err.response) {
							// ✅ Akses aman: res.err.response.data.message
							alert(res.err.response.data.message);
						} else {
							// Network Error murni atau Timeout
							alert("Kesalahan Jaringan. Cek koneksi Anda.");
						}
					} else {
						// Error non-Axios lainnya
						alert("Terjadi kesalahan saat memproses login.");
					}

					return;
				}

				// 2. Kasus Sukses (res.success === true)
				sessionStorage.setItem("token", res.data.token);
				dispatch(setUser(res.data.data));
				navigate("/");
			});
		}
	};
	const hndlLogout = () => {
		postFetch("/user/logout", {}).then((res) => {
			if (!res.success) {
				return;
			}

			dispatch(delUser());
			setislogin(false);
			sessionStorage.removeItem("token");
		});
	};

	console.log(data);

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

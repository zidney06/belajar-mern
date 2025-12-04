import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, delUser } from "../../slices/userSlice.ts";
import { getFetch, postFetch } from "../../utility/fetch.ts";
import MyContext from "../context/MyContext.ts";
import { isAxiosError } from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
	const [isRegister, setIsRegister] = useState<boolean>(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const username = useRef<HTMLInputElement>(null);
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const emailLogin = useRef<HTMLInputElement>(null);
	const passwordLogin = useRef<HTMLInputElement>(null);
	const [isLogin, setIsLogin] = useState<boolean>(false);
	const popup = useContext(MyContext);
	const [isGoogleLogin, setIsGoogleLogin] = useState<boolean>(false);

	useEffect(() => {
		if (!localStorage.getItem("alhidayah-token")) {
			return;
		}
		getFetch("/user/user-info").then((res) => {
			if (!res.success) {
				return dispatch(delUser());
			}
			setIsLogin(res.data.isLogin);
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
		// buat agar saat ada error, errornya ditampilkan seperti kalau salah password
		if (isRegister) {
			if (!username.current || !email.current || !password.current) {
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

			postFetch("/auth/register", data).then((res) => {
				if (!res.success) {
					if (isAxiosError(res.err)) {
						res.err.response &&
							popup({
								isShow: true,
								title: "Oops!",
								message: res.err.response.data.msg,
							});
					} else {
						// Error non-Axios lainnya
						popup({
							isShow: true,
							title: "Oops!",
							message: "Terjadi kesalahan saat memproses login.",
						});
					}
					return;
				}
				popup({
					isShow: true,
					title: "Success!",
					message: "Berhasil registrasi",
				});
				localStorage.setItem("alhidayah-token", res.data.token);
				navigate("/");
				resetInput();
			});
		} else {
			if (!emailLogin.current || !passwordLogin.current) {
				alert("Please fill all fields");
				return;
			}
			const data = {
				email: emailLogin.current.value,
				password: passwordLogin.current.value,
			};

			postFetch("/auth/login", data).then((res) => {
				// 1. Kasus Gagal (res.success === false)
				if (!res.success) {
					if (isAxiosError(res.err)) {
						res.err.response &&
							popup({
								isShow: true,
								title: "Oops!",
								message: res.err.response.data.msg,
							});
					} else {
						// Error non-Axios lainnya
						popup({
							isShow: true,
							title: "Oops!",
							message: "Terjadi kesalahan saat memproses login.",
						});
					}
					return;
				}
				localStorage.setItem("alhidayah-token", res.data.token);
				dispatch(setUser(res.data.data));
				navigate("/");
			});
		}
	};

	const hndlBackendAuthCode = async (res: any) => {
		const tipe = isRegister ? "register" : "login";

		try {
			postFetch("/auth/google/" + tipe, {
				code: res.code,
			}).then((res) => {
				if (!res.success) {
					if (isAxiosError(res.err)) {
						res.err.response &&
							popup({
								isShow: true,
								title: "Oops!",
								message: res.err.response.data.msg,
							});
					} else {
						// Error non-Axios lainnya
						popup({
							isShow: true,
							title: "Oops!",
							message: `Terjadi kesalahan saat ${isRegister ? "register" : "login"}`,
						});
					}
					return;
				}
				console.log("Data dari server:", res);

				// simpan jwt dan google access_token
				localStorage.setItem("alhidayah-token", res.data.token);
				setIsLogin(true);
				navigate("/");
			});
		} catch (error) {
			console.error("Login gagal dengan Backend:", error);
			alert("Login gagal. Silakan coba lagi.");
		}
	};

	const googleLogin = useGoogleLogin({
		flow: "auth-code",
		scope: "profile openid email",
		onSuccess: async (res) => {
			await hndlBackendAuthCode(res);
		},
		onError: () => console.log("Autentikasi Google Gagal"),
	});

	// buat fitur login dengan google dan pisahkan UI untuk register dari UIlogin biar rapi
	return (
		<div className="container-fluid d-flex dev-container">
			<div className="border border-2 border-info rounded w-50 mx-auto form text-center p-1 auth-box my-auto">
				<h3>{isRegister ? "Registrasi" : "Login"}</h3>
				{isLogin && <span>Anda sudah login</span>}
				{isRegister ? (
					<div className="px-3 my-1 my-2">
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
								Login
							</button>
							<button className="btn btn-outline-info" onClick={hndlSubmit}>
								Submit
							</button>
						</div>
						<div>
							<button className="btn btn-outline-info" onClick={googleLogin}>
								Daftar dengan Google
							</button>
						</div>
					</div>
				) : (
					<div className="px-3 my-1 my-2">
						<label className="form-label" htmlFor="emailLogin">
							email
						</label>
						<input
							type="email"
							id="emailLogin"
							ref={emailLogin}
							className="form-control form-control-sm"
						/>
						<label className="form-label" htmlFor="passwordLogin">
							password
						</label>
						<input
							type="password"
							id="passwordLogin"
							ref={passwordLogin}
							className="form-control form-control-sm"
						/>
						<div className="d-flex justify-content-between px-3 my-1 my-2">
							<button
								className="btn btn-outline-warning"
								onClick={() => setIsRegister(!isRegister)}
							>
								Register
							</button>
							<button className="btn btn-outline-info" onClick={hndlSubmit}>
								Submit
							</button>
						</div>
						<div>
							<button className="btn btn-outline-info" onClick={googleLogin}>
								Login dengan Google
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

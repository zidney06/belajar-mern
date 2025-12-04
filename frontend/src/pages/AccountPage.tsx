// disini akan berisi informasi akun seperti akun dibind dengan akun aplikasi atau dengan google

import { useEffect, useContext, useState } from "react";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { delFetch, getFetch, postFetch } from "../../utility/fetch.ts";
import MyContext from "../context/MyContext.ts";

// fitur logout akan dipindah kesini juga
export default function AccountPage() {
	const popup = useContext(MyContext);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLogin, setIsLogin] = useState<boolean>(false);
	const [user, setUser] = useState<any | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		getDataFromBackend();
	}, []);

	const getDataFromBackend = async () => {
		setTimeout(async () => {
			const res = await getFetch("/user/user-account");

			if (!res.success) {
				if (res.status === 401) {
					setIsLogin(false);
					localStorage.removeItem("alhidayah-token");
				}
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
				setIsLoading(false);
				return;
			}

			console.log(res.data);

			setUser(res.data.data);
			setIsLoading(false);
			setIsLogin(true);
		}, 700);
	};

	const hndlLogout = () => {
		if (!confirm("Apakah anda yakin?")) {
			return;
		}
		postFetch("/auth/logout", {}).then((res) => {
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
			navigate("/login");
			setIsLogin(false);
			localStorage.removeItem("alhidayah-token");
		});
	};

	const hndlBackendAuthCode = async (res: any) => {
		try {
			postFetch("/auth/bind-account", {
				code: res.code,
				bindWith: "google",
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
							message: `Terjadi kesalahan saat bind akun ke Google`,
						});
					}
					return;
				}
				console.log("Data dari server:", res);
				setUser(res.data.data);
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

	const bindAccount = () => {
		const loginMethode = ["email", "google"];
		const yangGakAda = loginMethode.filter((loginMethod) => {
			const isAda = user.loginWith.some((objekLogin: any) => {
				return objekLogin.type === loginMethod;
			});

			return !isAda;
		});

		if (yangGakAda[0] === "google") {
			googleLogin();
		} else if (yangGakAda[0] === "email") {
			navigate("/email-bind");
		} else {
			popup({
				isShow: true,
				title: "Oops!",
				message: "Sudah dibind dengan semua metode login",
			});
		}
	};

	const deleteAccount = () => {
		if (confirm("Apakah anda yakin ingin menghapus akun?")) {
			delFetch("/auth/delete-account").then((res) => {
				if (!res.success) {
					console.log(res);
					popup({
						isShow: true,
						title: "Gagal",
						message: "Akun gagal dihapus",
					});
				}
				localStorage.removeItem("alhidayah-token");
				navigate("/login");
				console.log(res);
				popup({
					isShow: true,
					title: "Berhasil",
					message: "Akun berhasil dihapus",
				});
			});
		}
	};

	const unBindAccount = (unbindType: string) => {
		if (user.loginWith.length <= 1) {
			popup({
				isShow: true,
				title: "Oops!",
				message: "Tidak bisa unbind metode login",
			});
		}
		if (
			!confirm(
				"Apakah anda yakin mau meng-unbind metode login dengan " + unbindType,
			)
		) {
			return;
		}
		console.log(unbindType);
		delFetch("/auth/unbind-account?unbindType=" + unbindType).then((res) => {
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
						message: `Terjadi kesalahan saat unbind akun!`,
					});
				}
				return;
			}
			console.log(res);
			setUser(res.data.data);
		});
	};

	console.log(user);

	if (isLoading) {
		return (
			<div className="container-fluid p-0 my-5 d-flex justify-content-center align-items-center dev-container">
				<div className="w-75 border border-2 border-info rounded p-3">
					<h1 className="text-center loading-text">
						Loading
						<span className="dot-1">.</span>
						<span className="dot-2">.</span>
						<span className="dot-3">.</span>
					</h1>
				</div>
			</div>
		);
	}

	if (!isLogin) {
		return (
			<div className="container-fluid p-0 my-5 d-flex justify-content-center align-items-center dev-container">
				<div className="w-75 border border-2 border-info rounded p-3">
					<h1 className="text-center">Harap Login Terlebih Dahulu</h1>
					<Link
						to="/login"
						className="btn btn-outline-primary mx-auto d-block w-25"
					>
						Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid px-4" style={{ minHeight: "100vh" }}>
			<div className="border border-2 border-info rounded p-2 mt-2">
				<h3 className="text-center">Account Page</h3>
				<div>
					<h4 className="text-center">User Information</h4>
					<div>
						<p>Username: {user.username}</p>
						<p>Login With:</p>
						{user.loginWith.map((loginMethod: any, index: number) => (
							<ul key={index} className="p-1 border rounded">
								<h4 className="text-center">{loginMethod.type}</h4>
								<p className="m-0">Email: {loginMethod.email}</p>
								<button
									className="btn btn-warning"
									onClick={() => unBindAccount(loginMethod.type)}
								>
									{loginMethod.type}-Unbind
								</button>
							</ul>
						))}
					</div>
					<div className="d-flex justify-content-between">
						<button className="btn btn-info" onClick={bindAccount}>
							Bind account
						</button>
						<button className="btn btn-danger" onClick={hndlLogout}>
							Logout
						</button>
						<button className="btn btn-danger" onClick={deleteAccount}>
							Delete account
						</button>
					</div>
				</div>
			</div>

			{/* Add your account information here */}
		</div>
	);
}

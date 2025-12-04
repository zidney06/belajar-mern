import { useRef, useContext } from "react";
import MyContext from "../context/MyContext.ts";
import { isAxiosError } from "axios";
import { postFetch } from "../../utility/fetch.ts";
import { useNavigate } from "react-router-dom";

export default function EmailBind() {
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const popup = useContext(MyContext);

	const hndlSubmit = () => {
		if (!email.current || !password.current) {
			return;
		}

		if (!email.current.value || !password.current.value) {
			popup({
				isShow: true,
				title: "Oops!",
				message: "Please fill all fields",
			});
			return;
		}
		const data = {
			email: email.current.value,
			password: password.current.value,
			bindWith: "email",
		};

		postFetch("/auth/bind-account", data).then((res) => {
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
				message: "Berhasil",
			});
			navigate("/account");
			// localStorage.setItem("alhidayah-token", res.data.token);
			resetInput();
		});
	};

	const resetInput = () => {
		if (!email.current || !password.current) {
			return console.log("Input fields are not initialized");
		}
		email.current.value = "";
		password.current.value = "";
	};

	return (
		<div className="container-fluid" style={{ minHeight: "100vh" }}>
			<div className="mt-3 p-0 d-flex justify-content-center align-items-center">
				<div className="w-75 border border-2 border-info rounded p-3">
					<h3 className="text-center">Email bind</h3>
					<div className="px-3 my-1 my-2">
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
							<button className="btn btn-outline-info" onClick={hndlSubmit}>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

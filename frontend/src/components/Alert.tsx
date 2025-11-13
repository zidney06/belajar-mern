interface PopUpConfig {
	isShow: boolean;
	title: string;
	message: string;
}

interface PopUpProps {
	popUp: PopUpConfig;
	changePopUp: (value: PopUpConfig) => void;
}

export default function Alert({ popUp, changePopUp }: PopUpProps) {
	const hndlClck = () => {
		changePopUp({
			isShow: !popUp.isShow,
			title: "",
			message: "",
		});
	};

	if (!popUp.isShow) {
		return;
	}

	return (
		<div className="pop-up-container d-flex justify-content-center align-items-center red">
			<div className="pop-up-box">
				<h5 className="text-dark">{popUp.title}</h5>
				<p className="text-dark">{popUp.message}</p>
				<button className="btn btn-danger" onClick={hndlClck}>
					close
				</button>
			</div>
		</div>
	);
}

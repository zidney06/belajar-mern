import { createContext } from "react";

interface PopUpConfig {
	isShow: boolean;
	title: string;
	message: string | string[];
}

type PopUp = (value: PopUpConfig) => void;

const PopupContext = createContext<PopUp>(() => {});

export default PopupContext;

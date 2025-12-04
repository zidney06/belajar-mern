import { StrictMode, createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<GoogleOAuthProvider clientId={clientId}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</GoogleOAuthProvider>
		</Provider>
	</StrictMode>,
);

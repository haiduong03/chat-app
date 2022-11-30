import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Chat from "./chat";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/chat" element={<Chat />} />
			</Routes>
		</BrowserRouter>
	);
}

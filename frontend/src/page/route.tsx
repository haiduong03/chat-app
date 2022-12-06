import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Chat from "./chat";
import Room from "./room";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/chat/:name" element={<Chat />} />
				<Route path="/room" element={<Room />} />
				<Route path="/information/:id" element={<Register />} />
			</Routes>
		</BrowserRouter>
	);
}

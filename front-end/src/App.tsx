import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:81", {
	transports: ["websocket", "polling", "flashsocket"],
});

function App() {
	const [text, setText] = useState("");
	const [person, setPerson] = useState("");
	const [check, setCheck] = useState(false);
	const [messages, setMessages] = useState([]);
	const send = async () => {
		const date = new Date();
		const h = date.getHours();
		const m = date.getMinutes();
		const time = h + ":" + m;
		if (!person) alert("Please enter your name");
		else {
			if (text.trim().length > 0) {
				const data = {
					sender: person,
					message: text,
					time: time,
				};
				await socket.emit("messageToServer", data);
			}
		}
	};

	useEffect(() => {
		socket.on("messagesToClient", (data) => {
			// setMessages((list) => [...list, data]);
			// setMessages(data);
			console.log(data);
		});
	}, [socket]);

	return (
		<div>
			<div id="messages">
				<>{console.log(messages)}</>
			</div>
			<div>
				<div>
					Name: {person}
					{!check && (
						<div>
							Enter name:
							<input
								type="text"
								value={person}
								onChange={(e) => {
									setPerson(e.target.value);
								}}
								onBlur={() => setCheck(true)}
							/>
						</div>
					)}
				</div>
			</div>
			<div>
				<textarea
					id="text"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
					}}
				></textarea>
				<div>
					<button onClick={send}>Submit</button>
				</div>
			</div>
		</div>
	);
}

export default App;

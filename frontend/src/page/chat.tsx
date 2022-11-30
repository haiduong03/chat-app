import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "../css/chat.css";
import axios from "axios";
import { Button, Form } from "antd";
const socket = io("http://localhost:80", {
	transports: ["websocket", "polling"],
});
async function getName() {
	const result = await axios.get(
		`http://localhost:3001/user/find-user-by-email/${}`,
	);
	const person = result.data;
}
function Chat() {
	const [text, setText] = useState<string>("");

	const [messages, setMessages] = useState<any[]>([]);
	const listRef = useRef<HTMLUListElement | any>(null);

	const result = messages.map((data: any, index) => (
		<ul key={index}>
			<h3>{data.sender}</h3>
			<p>{data.message}</p>
			<ul>
				<sup>{data.time}</sup>
			</ul>
		</ul>
	));

	const send = () => {
		const date = new Date();
		const h = date.getHours();
		const m = date.getMinutes();
		const time = h + ":" + m;
		// if (!person || person.trim().length < 0) alert("Please enter your name");
		// else {
		if (text.trim().length > 0) {
			const data = {
				sender: person,
				message: text,
				time: time,
			};
			// socket.emit("connection", person);
			socket.emit("messageToServer", data);
		}
		// }
	};

	useState(async () => {
		const result = await axios.get("http://localhost:3001/user/all-message");
		setMessages(messages.concat(result.data.reverse()));
	});

	useEffect(() => {
		socket.on("messageToClient", (data) => {
			setMessages(messages.concat([data]));
		});
		listRef.current?.lastElementChild?.scrollIntoView();
	}, [messages]);

	return (
		<div className="container">
			<div id="messages" ref={listRef}>
				{result}
			</div>
			<div className="container">Name:{person}</div>
			<div>
				<textarea
					className="textarea"
					id="text"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
					}}
				></textarea>
				<Form.Item className="form-register">
					<Button type="primary" className="bunton" onClick={send}>
						Submit
					</Button>
				</Form.Item>
			</div>
		</div>
	);
}

export default Chat;

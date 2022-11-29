import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "../css/Chat.css";
import axios from "axios";

const socket = io("http://localhost:80", {
	transports: ["websocket", "polling"],
});

function Chat() {
	const [text, setText] = useState<string>("");
	const [person, setPerson] = useState<string>("");
	const [check, setCheck] = useState<boolean>(false);
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
		if (!person || person.trim().length < 0) alert("Please enter your name");
		else {
			if (text.trim().length > 0) {
				const data = {
					sender: person,
					message: text,
					time: time,
				};
				// socket.emit("connection", person);
				socket.emit("messageToServer", data);
			}
		}
	};

	useState(async () => {
		// socket.on("connected", (human) => {});
		const result = await axios.get("http://localhost:3000/user/all-message");
		setMessages(messages.concat(result.data.reverse()));
	});

	useEffect(() => {
		socket.on("messageToClient", (data) => {
			setMessages(messages.concat([data]));
		});
		listRef.current?.lastElementChild?.scrollIntoView();
	}, [messages]);

	return (
		<div>
			{/* <div>
				Room: <b>Testing</b>{" "}
			</div> */}
			<div id="messages" ref={listRef}>
				{result}
			</div>
			<div>
				Name: &emsp; {person}
				{!check && (
					<div>
						Enter name: &emsp;
						<input
							type="text"
							value={person}
							onChange={(e) => {
								setPerson(e.target.value);
							}}
							onBlur={() => {
								if (person) setCheck(true);
							}}
						/>
					</div>
				)}
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

export default Chat;

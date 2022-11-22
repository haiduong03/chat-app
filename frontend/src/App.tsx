import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:81", {
	transports: ["websocket", "polling"],
});

function App() {
	const [text, setText] = useState<string>("");
	const [person, setPerson] = useState<string>("");
	const [check, setCheck] = useState<boolean>(false);
	const [messages, setMessages] = useState<any[]>([]);
	const listRef = useRef<HTMLUListElement | any>(null);

	const result = messages.map((data: any) => (
		<ul key={data.id}>
			<h3>{data.sender}</h3>
			<li>{data.message}</li>
			<sup>{data.time}</sup>
		</ul>
	));

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
		socket.on("messageToClient", (data) => {
			setMessages(messages.concat([data]));
		});
		listRef.current?.lastElementChild?.scrollIntoView();
	}, [messages]);

	return (
		<div>
			<div>
				Room: <b>Testing</b>{" "}
			</div>
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

export default App;

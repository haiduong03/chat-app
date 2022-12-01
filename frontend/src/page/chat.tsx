import { Button, Dropdown, Form, Menu, Space } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:80", {
	transports: ["websocket", "polling"],
});

function Chat() {
	const navigate = useNavigate();
	const logout = () => {
		localStorage.clear();
		navigate("/");
	};
	const menu1 = (
		<Menu
			items={[
				{
					key: "1",
					label: (
						<p className="hover" onClick={logout}>
							Log out
						</p>
					),
				},
			]}
		/>
	);
	const menu2 = (
		<Menu
			items={[
				{
					key: "1",
					label: (
						<p
							className="hover"
							// onClick={() => {
							// 	navigate(`infor/${id}`);
							// }}
						>
							Information
						</p>
					),
				},
				{
					key: "2",
					label: (
						<p
							className="hover"
							// onClick={() => {
							// 	navigate(`infor/${id}`);
							// }}
						>
							Add friend
						</p>
					),
				},
			]}
		/>
	);

	const [text, setText] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [messages, setMessages] = useState<any[string]>([]);
	const listRef = useRef<HTMLUListElement | any>(null);

	const listMessage = messages.map((data: any, index: any) => {
		if (data.sender === name) {
			return (
				<ul className="human" key={index}>
					<p className="input"> Me</p>
					<p>{data.message}</p>
					<ul>
						<sup>{data.time}</sup>
					</ul>
				</ul>
			);
		}
		return (
			<ul className="human" key={index}>
				<p className="input">
					<Dropdown overlay={menu2}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>{data.sender}</Space>
						</a>
					</Dropdown>
				</p>
				<p>{data.message}</p>
				<ul>
					<sup>{data.time}</sup>
				</ul>
			</ul>
		);
	});

	const send = () => {
		const date = new Date();
		const h = date.getHours();
		const m = date.getMinutes();
		const time = h + ":" + m;
		const texts = text.trimStart().trimEnd();
		if (texts.length > 0) {
			const data = {
				sender: name,
				message: texts,
				time: time,
			};
			socket.emit("messageToServer", data);
		}
	};

	useState(async () => {
		// const token = localStorage.getItem("token");
		const email = localStorage.getItem("email");

		const getMessage = await axios.get(
			"http://localhost:3001/user/all-message",
		);
		setMessages(messages.concat(getMessage.data.reverse()));

		const getName = await axios.get(
			`http://localhost:3001/user/find-user-by-email/${email}`,
		);
		setName(getName.data.name);
	});

	useEffect(() => {
		socket.on("messageToClient", (data) => {
			setMessages(messages.concat([data]));
		});
		listRef.current?.lastElementChild?.scrollIntoView();
	}, [messages]);

	return (
		<div className="container">
			<div className="messages" ref={listRef}>
				{listMessage}
			</div>
			<div className="input">
				Name:
				<Dropdown overlay={menu1}>
					<a onClick={(e) => e.preventDefault()}>
						<Space>{name}</Space>
					</a>
				</Dropdown>
			</div>
			<div className="container">
				<textarea
					className="textarea"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
					}}
					placeholder="Write a message..."
				></textarea>
				<Form.Item className="input">
					<Button className="button" type="primary" onClick={send}>
						Send
					</Button>
				</Form.Item>
			</div>
		</div>
	);
}

export default Chat;

import { Button, Form, notification, Popover, Space } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
const socket = io("http://localhost:80", {
	transports: ["websocket", "polling"],
});

function Chat() {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const logOut = () => {
		localStorage.clear();
		notification.info({
			placement: "top",
			message: "Logout success !!!",
		});
		navigate("/");
	};

	const findGuest = async (name: string) => {
		return await axios.get(
			`http://localhost:3001/user/find-user-by-name/${name}`,
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
	};

	const infor = async (name: string) => {
		const result = await findGuest(name);
		navigate(`/information/${result.data._id}`);
	};

	const addFriend = async (name: string) => {
		const result = await findGuest(name);
		console.log(result.data._id);
	};

	// const items: MenuProps["items"] = [
	// 	{
	// 		key: "1",
	// 		label: (
	// 			<div className="hover" onClick={logOut}>
	// 				Log out
	// 			</div>
	// 		),
	// 	},
	// ];

	const logout = (
		<div className="hover" onClick={logOut}>
			Log out
		</div>
	);

	const guestData = (name: string) => {
		return [
			<div key={uuidv4()}>
				<p className="hover" onClick={() => infor(name)}>
					Information
				</p>
				<p className="hover" onClick={() => addFriend(name)}>
					Add friend
				</p>
			</div>,
		];
	};

	const [text, setText] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [messages, setMessages] = useState<any[string]>([]);
	const listRef = useRef<HTMLUListElement | any>(null);

	const listMessage = messages.map((data: any, index: any) => {
		if (data.sender === name) {
			return (
				<ul className="human" key={index}>
					<div className="input sender">
						<Space>You</Space>
					</div>
					<div className="textarea sender">{data.message}</div>
					<ul>
						<sup className="receiver">{data.time}</sup>
					</ul>
				</ul>
			);
		}
		return (
			<ul className="human" key={index}>
				<div className="input receiver">
					<Popover placement="bottom" content={guestData(data.sender)}>
						<Space>{data.sender}</Space>
					</Popover>
				</div>
				<div className="textarea receiver">{data.message}</div>
				<ul>
					<sup className="sender">{data.time}</sup>
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
		const getMessage = await axios.get(
			"http://localhost:3001/user/all-message",
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		setMessages(messages.concat(getMessage.data.reverse()));

		const email = localStorage.getItem("email");
		const getName = await axios.get(
			`http://localhost:3001/user/find-user-by-email/${email}`,
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
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
				<Popover placement="bottom" content={logout}>
					<Space>{name}</Space>
				</Popover>
				{/* <Dropdown menu={{ items }}>
					<div onClick={(e) => e.preventDefault()}>
						<Space>Hover me</Space>
					</div>
				</Dropdown> */}
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

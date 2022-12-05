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
	const [text, setText] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [messages, setMessages] = useState<any[string]>([]);
	const listRef = useRef<HTMLUListElement | any>(null);

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

	const addFriend = async (guestName: string) => {
		const guest = await findGuest(guestName);
		const guestID = guest.data.name;
		const user = await findGuest(name);
		const userID = user.data.name;
		const result = await axios.post(
			"http://localhost:3001/user/request-friend",
			{ from: userID, to: guestID },
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		if (result.data.result)
			notification.success({
				placement: "top",
				message: "Add friend",
				description: "Request successful",
			});
	};

	const chat = async (name: string) => {
		const result = await findGuest(name);

		navigate(`/chat/${result.data._id}`);
	};

	const logout = (
		<div>
			<Button className="input hover" onClick={() => infor(name)}>
				About
			</Button>
			<Button className="input hover" onClick={logOut}>
				Log out
			</Button>
		</div>
	);

	const guestData = (name: string) => {
		return [
			<div key={uuidv4()}>
				<Button className="input hover" onClick={() => infor(name)}>
					Information
				</Button>
				<Button className="input hover" onClick={() => chat(name)}>
					Chat
				</Button>
				<Button className="input hover" onClick={() => addFriend(name)}>
					Add friend
				</Button>
			</div>,
		];
	};

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
			socket.emit("send", data);
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
		const result = await axios.get(
			`http://localhost:3001/user/find-user-by-email/${email}`,
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		setName(result.data.name);
	});

	useEffect(() => {
		socket.on("receive", (data) => {
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
					<Button className="input hover" type="primary" onClick={send}>
						Send
					</Button>
				</Form.Item>
			</div>
		</div>
	);
}
export default Chat;

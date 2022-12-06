import { Button, Form, Input, notification, Space } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:80", {
	transports: ["websocket", "polling"],
});

function Room() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const roomRef = useRef<any>("");
	const [rooms, setRooms] = useState<string[]>([]);
	const email = localStorage.getItem("email");
	const chat = (data: string) => {
		navigate(`/chat/${data}`);
	};

	const create = () => {
		const room = roomRef.current.input.value;
		socket.emit("create-room", { room, email });
	};

	const join = () => {
		const room = roomRef.current.input.value;
		socket.emit("join-room", room);
	};

	useState(async () => {
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
		localStorage.setItem("userName", result.data.name);
		setRooms(rooms.concat(result.data.room, result.data.friend));
	});

	const listRoom = rooms.map((data: any, index: any) => {
		return (
			<Button
				className="hover input"
				key={index}
				onClick={() => {
					chat(data);
				}}
			>
				{data}
			</Button>
		);
	});

	useEffect(() => {
		socket.on("created-room", (data) => {
			if (data === 0) {
				const result = notification.warning({
					placement: "top",
					message: "Room existed !!!",
				});
				return result;
			} else {
				notification.success({
					placement: "top",
					message: `Created ${data}!!!`,
				});
				const result = navigate(`/chat/${data}`);
				return result;
			}
		});

		socket.on("joined-room", (data) => {
			// if (data === 0) {
			// 	const result = notification.warning({
			// 		placement: "top",
			// 		message: "Room existed !!!",
			// 	});
			// 	return result;
			// } else {
			// 	notification.success({
			// 		placement: "top",
			// 		message: `Created ${data}!!!`,
			// 	});
			// 	const result = navigate(`/chat/${data}`);
			// 	return result;

			console.log(data);
		});
	}, [roomRef]);
	if (listRoom.length > 0) {
		return (
			<React.Fragment>
				<Form className="input" layout={"vertical"}>
					{/* <Form className="input" onFinish={create} layout={"vertical"}> */}
					<Form.Item
						className="form-register"
						label={<Space className="input">Room</Space>}
					>
						<Input
							className="textarea"
							ref={roomRef}
							placeholder="Enter room name..."
						/>
					</Form.Item>
					<Form.Item>
						<Button
							htmlType="submit"
							className="input hover"
							type="primary"
							onClick={create}
						>
							Create
						</Button>
						<Button
							htmlType="submit"
							className="input hover button-accept"
							onClick={join}
						>
							Join
						</Button>
					</Form.Item>
				</Form>
				<div className="form-register input messages">{listRoom}</div>
			</React.Fragment>
		);
	} else {
		return (
			<Form className="input" onFinish={create} layout={"vertical"}>
				<Form.Item
					className="form-register"
					label={<div className="input">Room</div>}
				>
					<Input
						className="textarea"
						ref={roomRef}
						placeholder="Enter room name..."
					/>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" className="input hover" type="primary">
						Create
					</Button>
					<Button
						htmlType="submit"
						className="input hover button-accept"
						onClick={join}
					>
						Join
					</Button>
				</Form.Item>
			</Form>
		);
	}
}
export default Room;

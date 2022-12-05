import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Register() {
	const [listReceiveRequest, setListReceiveRequest] = useState<any[string]>([]);
	const [listSendRequest, setListSendRequest] = useState<any[string]>([]);
	const navigate = useNavigate();
	const [user, setUser] = useState<{
		id: string;
		name: string;
		email: string;
		phone: number;
		password: string;
		status: boolean;
		friend?: string[];
		room?: string[];
	}>({
		id: "",
		name: "",
		email: "",
		phone: 0,
		password: "",
		status: false,
		friend: [],
		room: [],
	});

	const createUser = async (user: any) => {
		const result = await axios.post("http://localhost:3001/user/create-user", {
			email: user.email,
			phone: user.phone,
			name: user.name,
			password: user.password,
		});
		if (result.data.result) {
			notification.success({
				placement: "top",
				message: "Register",
				description: `Created ${result.data.result}`,
			});
			navigate("/");
		} else
			notification.warning({
				placement: "top",
				message: "Register",
				description: `${JSON.stringify(
					result.data.keyValue.email || result.data.keyValue.name,
				)} already exists`,
			});
	};
	const login = () => {
		navigate("/");
	};
	const { id } = useParams();
	const token = localStorage.getItem("token");

	useState(async () => {
		const result = await axios.get(
			`http://localhost:3001/user/find-user-by-id/${id}`,
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		setUser(result.data);

		const receiveReq = await axios.get(
			`http://localhost:3001/user/list-receive-request-friend/${result.data.name}`,
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		setListReceiveRequest(receiveReq.data);

		const sendReq = await axios.get(
			`http://localhost:3001/user/list-send-request-friend/${result.data.name}`,
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-type": "Application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		setListSendRequest(sendReq.data);
	});

	const listReceiveReq = () => {
		return listReceiveRequest.map((e: any) => {
			return (
				<Form key={e._id}>
					<div className="input">
						<div>{e.from}</div>
						<Button className="input hover button-accept">Accept</Button>
						<Button className="input hover button-cancel">Deny</Button>
					</div>
				</Form>
			);
		});
	};

	const listSendReq = () => {
		return listSendRequest.map((e: any) => {
			return (
				<Form key={e._id}>
					<div className="input">
						<div>{e.to}</div>
						<Button className="input hover button-cancel">Cancel</Button>
					</div>
				</Form>
			);
		});
	};

	if (id) {
		if (localStorage.getItem("email") === user.email) {
			return (
				<div>
					<Form className="form-register">
						<p className="input">{user.name}</p>
						<p className="input">Email: {user.email}</p>
						<p className="input">Phone: {user.phone}</p>
					</Form>
					<div className="table container">
						<div className="textarea input custom-scroll">
							<p className="input">Receive: </p>
							{listReceiveReq()}
						</div>
						<div className=" textarea input custom-scroll">
							<p className="input">Send: </p>
							{listSendReq()}
						</div>
					</div>
				</div>
			);
		}
		return (
			<Form className="form-register">
				<p className="input">{user.name}</p>
				<p className="input">Email: {user.email}</p>
				<p className="input">Phone: {user.phone}</p>
				<Form.Item>
					<Button className="input hover" type="primary">
						Chat
					</Button>
					<Button className="input hover button-accept">Add Friend</Button>
				</Form.Item>
			</Form>
		);
	} else {
		return (
			<Form
				name="basic"
				onFinish={createUser}
				className="form-register"
				layout={"vertical"}
			>
				<h1 className="lbl-register">Registration</h1>

				<Form.Item
					label={<label className="lbl">User name</label>}
					name="name"
					rules={[{ required: true, message: "Please input your username!" }]}
				>
					<Input className="input" />
				</Form.Item>

				<Form.Item
					label={<label className="lbl">E-mail</label>}
					name="email"
					rules={[
						{
							type: "email",
							message: "The input is not valid E-mail!",
						},
						{
							required: true,
							message: "Please input your E-mail!",
						},
					]}
				>
					<Input className="input" />
				</Form.Item>

				<Form.Item
					label={<label className="lbl">Password</label>}
					name="password"
					rules={[{ required: true, message: "Please input your password!" }]}
				>
					<Input.Password className="input" />
				</Form.Item>

				<Form.Item
					name="confirm"
					label={<label className="lbl">Confirm password</label>}
					dependencies={["password"]}
					hasFeedback
					rules={[
						{
							required: true,
							message: "Please confirm your password!",
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("password") === value) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error("The two passwords that you entered do not match!"),
								);
							},
						}),
					]}
				>
					<Input.Password className="input" />
				</Form.Item>

				<Form.Item
					label={<label className="lbl">Phone number</label>}
					name="phone"
					rules={[
						{ required: true, message: "Please input your phone number!" },
					]}
				>
					<Input className="input" />
				</Form.Item>

				<Form.Item>
					<Button className="input hover" type="primary" htmlType="submit">
						Register
					</Button>
					<Button
						className="input hover"
						type="primary"
						htmlType="submit"
						onClick={login}
					>
						Login
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default Register;

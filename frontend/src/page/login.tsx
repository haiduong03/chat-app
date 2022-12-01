import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const login = async (user: any) => {
		const result = await axios.post("http://localhost:3001/user/login", {
			email: user.email,
			password: user.password,
		});
		if (result.data.token) {
			notification.success({
				placement: "top",
				message: "Login success !!!",
			});
			localStorage.setItem("token", result.data.token);
			localStorage.setItem("email", user.email);
			navigate("/chat");
		} else
			notification.warning({
				placement: "top",
				message: "Login failed",
				description: `${result.data.result}`,
			});
	};
	const register = () => {
		navigate("/register");
	};

	return (
		<Form
			name="basic"
			onFinish={login}
			className="form-register"
			layout={"vertical"}
		>
			<h1 className="lbl-register">Login</h1>
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

			<Form.Item>
				<Button className="button" type="primary" htmlType="submit">
					Login
				</Button>
				<Button className="button" type="primary" onClick={register}>
					Register
				</Button>
			</Form.Item>
		</Form>
	);
}

export default Login;

import { Button, Form, Input, notification } from "antd";
import axios from "axios";
import "../css/form.css";

const createUser = async (user: any) => {
	const result = await axios.post("http://localhost:3001/user/create-user", {
		email: user.email,
		phone: user.phone,
		name: user.name,
		password: user.password,
	});
	if (result.data.result)
		notification.success({
			placement: "top",
			message: "Register",
			description: `Created ${result.data.result}`,
		});
	//link to login page
	else
		notification.success({
			placement: "top",
			message: "Register",
			description: `${JSON.stringify(
				result.data.keyValue.email || result.data.keyValue.name,
			)} already exists`,
		});
};

function Register() {
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
				rules={[{ required: true, message: "Please input your phone number!" }]}
			>
				<Input className="input" />
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Register
				</Button>
			</Form.Item>
		</Form>
	);
}

export default Register;

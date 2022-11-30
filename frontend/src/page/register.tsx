// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";
// import "../css/register.css";
// // import { Chat } from "../page/chat";

// function Register() {
// 	const { register, handleSubmit } = useForm();

// 	const onSubmit = (data: any) => {
// 		console.log(data);
// 		// console.log(errors);
// 	};

// 	return (
// 		<div>
// 			<form onSubmit={handleSubmit(onSubmit)}>
// 				<h1>Register</h1>
// 				<input
// 					type="text"
// 					placeholder="User name"
// 					{...register("User name", { required: true, maxLength: 70 })}
// 				/>
// 				<input
// 					type="text"
// 					placeholder="Email"
// 					{...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
// 				/>
// 				<input
// 					type="tel"
// 					placeholder="Phone number"
// 					{...register("Phone number", {
// 						required: true,
// 						pattern: /[0-9]/,
// 						minLength: 10,
// 						maxLength: 13,
// 					})}
// 				/>
// 				<input
// 					type="password"
// 					placeholder="Password"
// 					{...register("Password", { required: true })}
// 				/>
// 				<div>
// 					<button type="submit">Register</button>
// 					<Link to="/chat" component>
// 						<button>Login</button>
// 					</Link>
// 				</div>
// 			</form>
// 		</div>
// 	);
// }

// export default Register;
import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';

function Register {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
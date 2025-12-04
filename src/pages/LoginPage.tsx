import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, App } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const { useApp } = App;

interface LoginFormValues {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => {
  const { message } = useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", values.email);
      formData.append("password", values.password);

      const response = await axios.post(`${API_URL}/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("username", values.email);

      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Lecturer Login</Title>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Log In
            </Button>
            or <a href="/register">Register now!</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

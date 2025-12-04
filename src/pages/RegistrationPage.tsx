import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, App } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const { useApp } = App;

const RegisterPage: React.FC = () => {
  const { message } = useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/register`,
        {
          email: values.email,
          password: values.password,
          lecturer_name: values.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      message.success("Registration successful!");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError && error.response?.status === 400) {
        message.error("An account with this email already exists.");
      } else {
        message.error("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
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
          <Title level={3}>Lecturer Registration</Title>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
          </Form.Item>
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
          <Form.Item
            name="confirm"
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
                    new Error(
                      "The new password that you entered do not match!",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Register
            </Button>
            Already have an account? <a href="/login">Log In</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;

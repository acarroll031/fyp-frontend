import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Button, Layout, List, Popover, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance.ts";

const { Header } = Layout;

const navItems = [
  { key: "1", label: "Dashboard" },
  { key: "2", label: "Submit Assessments" },
  { key: "3", label: "Your Modules" },
];

interface NotificationPayload {
  text: string;
  studentId?: string;
  moduleId?: string;
  type?: "RISK_ALERT" | "SYSTEM_ALERT";
}

// Helper function to parse notification messages with strong typing
const parseMessage = (rawMessage: string): NotificationPayload => {
  try {
    const parsed = JSON.parse(rawMessage);
    // Check to see parsed content is an object with expected properties
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as NotificationPayload;
    }
    // Fallback if parsed content isn't an object
    return { text: rawMessage };
  } catch (e) {
    // Fallback for old legacy notifications that are just plain text
    console.log(e);
    return { text: rawMessage };
  }
};

interface Notification {
  id: number;
  lecturer_email: string;
  message: string;
  notification_type?: string;
  is_read: boolean;
  created_at: string;
}

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = Boolean(localStorage.getItem("access_token"));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axiosInstance.get(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications().then();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [API_URL]);

  const toggleReadStatus = async (item: Notification, e?: React.MouseEvent) => {
    // Prevent the click from bubbling up (so it doesn't trigger the page redirect if you just clicked the button)
    if (e) e.stopPropagation();

    const token = localStorage.getItem("access_token");
    const newStatus = !item.is_read; // Toggle the current status

    // Update UI immediately
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_read: newStatus } : n)),
    );

    try {
      // Call the correct API endpoint based on the new status
      const endpoint = newStatus
        ? `${API_URL}/notifications/${item.id}/read`
        : `${API_URL}/notifications/${item.id}/unread`;

      await axiosInstance.put(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Failed to update notification status", error);
      // Revert change if API fails
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: !newStatus } : n)),
      );
    }
  };

  const notificationContent = (
    <List
      style={{ width: 350, maxHeight: 400, overflow: "auto" }}
      dataSource={notifications}
      renderItem={(item: Notification) => {
        // Use the helper to get strongly-typed data
        const content = parseMessage(item.message);

        return (
          <List.Item
            style={{
              padding: 10,
              cursor: content.studentId ? "pointer" : "default",
              borderBottom: "1px solid #303030",
            }}
            actions={[
              <Button
                type="link"
                size="small"
                onClick={(e) => toggleReadStatus(item, e)}
              >
                {item.is_read ? "Mark Unread" : "Mark Read"}
              </Button>,
            ]}
            onClick={() => {
              if (content.studentId && content.moduleId) {
                navigate(`/student/${content.studentId}/${content.moduleId}`);
              }
            }}
          >
            <List.Item.Meta
              avatar={
                !item.is_read ? (
                  <Badge status="error" style={{ marginTop: 8 }} />
                ) : (
                  // Invisible spacer to keep alignment consistent
                  <div
                    style={{ width: 6, height: 6, display: "inline-block" }}
                  />
                )
              }
              title={
                item.is_read ? content.text : <strong>{content.text}</strong>
              }
              description={
                <>
                  {content.type === "RISK_ALERT" && (
                    <span
                      style={{
                        color: "#cf1322",
                        fontWeight: "bold",
                        marginRight: 5,
                      }}
                    >
                      RISK
                    </span>
                  )}
                  <small>{new Date(item.created_at).toLocaleString()}</small>
                </>
              }
            />
          </List.Item>
        );
      }}
    />
  );

  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/":
        return ["1"];
      case "/submit":
        return ["2"];
      case "/myModules":
        return ["3"];
      default:
        return ["1"];
    }
  };

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "1":
        navigate("/");
        break;
      case "2":
        navigate("/submit");
        break;
      case "3":
        navigate("/myModules");
        break;
      default:
        navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div
        className="logo"
        style={{
          color: "white",
          marginRight: "24px",
          fontSize: "1.2rem",
          gap: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={"graduate.svg"} alt={"Logo"} style={{ height: 34 }} />
        <span style={{ fontSize: "0.9rem" }}>Student Risk Predictor</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getSelectedKey()}
        items={navItems}
        style={{ flex: 1, minWidth: 0 }}
        onClick={handleMenuClick}
      />
      <Popover
        content={notificationContent}
        title="Notifications"
        trigger="click"
        placement="bottomRight"
      >
        <Badge
          count={notifications.filter((n) => !n.is_read).length}
          offset={[-20, 5]}
        >
          <BellOutlined
            style={{
              fontSize: 24,
              color: "white",
              marginRight: 30,
              cursor: "pointer",
            }}
          />
        </Badge>
      </Popover>
      {loggedIn && (
        <Button onClick={handleLogout} className="btn btn-outline-danger">
          Logout
        </Button>
      )}
    </Header>
  );
}

export default NavBar;

import React from "react";
import {
  Layout,
  Menu,
  App as AntApp,
  ConfigProvider,
  theme,
  Button,
} from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import SubmitAssignmentsPage from "./pages/SubmitAssignmentsPage.tsx";
import ModulesPage from "./pages/ModulesPage.tsx";

const { Header, Content, Footer } = Layout;

const navItems = [
  { key: "1", label: "Dashboard" },
  { key: "2", label: "Submit Assessments" },
  { key: "3", label: "Your Modules" },
  { key: "4", label: "Notifications" },
  { key: "5", label: "Profile" },
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = Boolean(localStorage.getItem("access_token"));

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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <AntApp>
        <Layout style={{ minHeight: "100vh" }}>
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
            {loggedIn && (
              <Button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
              </Button>
            )}
          </Header>

          <Content
            style={{
              padding: "24px 48px",
              backgroundImage: "url('/site-background.jpg')",
              backgroundSize: "cover",
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 380,
              }}
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/submit" element={<SubmitAssignmentsPage />} />
                  <Route path="/myModules" element={<ModulesPage />} />
                </Route>
              </Routes>
            </div>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            Predictive Analytics ©2025 Created by a Final Year Student
          </Footer>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;

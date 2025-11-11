import React from "react";
import { Layout, Menu, App as AntApp, ConfigProvider, theme } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";


import DashboardPage from "./pages/DashboardPage";
import SubmitPage from "./pages/SubmitAssignmentsPage.tsx";

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

  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/":
        return ["1"];
      case "/submit":
        return ["2"];
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
      default:
        navigate("/");
    }
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
              <img src={"graduate.svg"} alt={"Logo"} style={{height: 34}} />
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
          </Header>

          <Content
              style={{
                  padding: "24px 48px",
                  backgroundImage: "url('/site-background.jpg')",
                  backgroundSize: 'cover',}}
          >
            <div
              style={{
                padding: 24,
                minHeight: 380,

              }}
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/submit" element={<SubmitPage />} />
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

import React, { useEffect } from "react";
import { Layout, App as AntApp, ConfigProvider, theme } from "antd";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import SubmitAssignmentsPage from "./pages/SubmitAssignmentsPage.tsx";
import ModulesPage from "./pages/ModulesPage.tsx";
import RegisterPage from "./pages/RegistrationPage.tsx";
import NavBar from "./Components/NavBar.tsx";
import StudentDetailsPage from "./pages/StudentDetailsPage.tsx";

const { Content, Footer } = Layout;

const App: React.FC = () => {
  const location = useLocation();
  const [showNavBar, setShowNavBar] = React.useState(true);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
  }, [location]);
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <AntApp>
        <Analytics />
        <Layout
          style={{
            minHeight: "100vh",
            backgroundImage: "url('/site-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {showNavBar && <NavBar />}
          <Content
            style={{
              padding: "24px 48px",
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
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/submit" element={<SubmitAssignmentsPage />} />
                  <Route path="/myModules" element={<ModulesPage />} />
                  <Route
                    path={"/student/:studentId"}
                    element={<StudentDetailsPage />}
                  />
                </Route>
              </Routes>
            </div>
          </Content>

          <Footer style={{ textAlign: "center" }}>
            Student Risk Predictor ©2025 Created by Adam Carroll, a CSSE Final
            Year Student
          </Footer>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;

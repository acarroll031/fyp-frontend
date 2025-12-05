import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Typography,
  Button,
  Spin,
  Row,
  Col,
  Tag,
  Statistic,
} from "antd";
import { ArrowLeftOutlined, LineChartOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface Data {
  student: {
    student_id: number;
    student_name: string;
    module: string;
    average_score: number;
    assessments_completed: number;
    performance_trend: number;
    max_consecutive_misses: number;
    progress_in_semester: number;
    risk_score: number;
  };
  grades: {
    assessment_number: number;
    score: number;
    progress_in_semester: number;
  }[];
}

const { Title, Text } = Typography;

const API_URL = import.meta.env.VITE_API_URL;

const StudentDetailsPage: React.FC = () => {
  const { studentId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${API_URL}/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [studentId]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  if (!data)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        Student not found
      </div>
    );

  const { student, grades } = data;

  // determine risk color
  const riskColor =
    student.risk_score > 70
      ? "#cf1322"
      : student.risk_score > 40
        ? "#faad14"
        : "#3f8600";

  return (
    <div style={{ padding: "24px", maxWidth: 1800, margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        style={{ marginBottom: 16 }}
      >
        Back to Dashboard
      </Button>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col span={12}>
            <Title level={2} style={{ margin: 0 }}>
              {student.student_name}
            </Title>
            <Text type="secondary">
              Student ID: {student.student_id} | Module: {student.module}
            </Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Statistic
              title="Current Risk Score"
              value={student.risk_score}
              precision={1}
              valueStyle={{ color: riskColor, fontWeight: "bold" }}
              suffix="/ 100"
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <>
                <LineChartOutlined /> Performance Trajectory
              </>
            }
            style={{ height: "100%" }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={grades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="assessment_number"
                    label={{
                      value: "Assessment #",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    label={{
                      value: "Score",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#1890ff"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Text strong>Performance Trend: </Text>
              <Tag color={student.performance_trend >= 0 ? "green" : "red"}>
                {student.performance_trend > 0 ? "+" : ""}
                {student.performance_trend.toFixed(2)}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Grade History" style={{ height: "100%" }}>
            <Table
              dataSource={grades}
              rowKey="assessment_number"
              pagination={false}
              scroll={{ y: 240 }}
              columns={[
                {
                  title: "Assessment #",
                  dataIndex: "assessment_number",
                },
                {
                  title: "Score",
                  dataIndex: "score",
                  render: (val) => (
                    <Text type={val < 40 ? "danger" : undefined}>
                      {val.toFixed(1)}%
                    </Text>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDetailsPage;

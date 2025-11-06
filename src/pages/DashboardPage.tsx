import React from "react";
import { Flex, Card, Statistic, Space, Table, Tag, Input } from "antd";
import type { TableProps } from "antd"; // Import the TableProps type
import { ArrowUpOutlined, WarningOutlined } from "@ant-design/icons";

const { Search } = Input;

interface Student {
  key: string;
  studentNumber: string;
  fullName: string;
  module: string;
  riskScore: number;
  status: "At Risk" | "Improving" | "On Track" | "Newly At Risk";
}

const tableColumns: TableProps<Student>["columns"] = [
  {
    title: "Student Number",
    dataIndex: "studentNumber",
    key: "studentNumber",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Module",
    dataIndex: "module",
    key: "module",
  },
  {
    title: "Risk Score",
    dataIndex: "riskScore",
    key: "riskScore",
    sorter: (a, b) => a.riskScore - b.riskScore,
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status) => {
      let color;
      if (status === "At Risk") color = "volcano";
      else if (status === "Improving") color = "green";
      else color = "geekblue";
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
];

const tableData: Student[] = [
  {
    key: "1",
    studentNumber: "20012345",
    fullName: "John Doe",
    module: "CS161",
    riskScore: 25,
    status: "Improving",
  },
  {
    key: "2",
    studentNumber: "20054321",
    fullName: "Jane Smith",
    module: "CS161",
    riskScore: 82,
    status: "At Risk",
  },
];

const DashboardPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Flex gap="large">
        <Card>
          <Statistic
            title="Students at Risk"
            value={12}
            valueStyle={{ color: "#cf1322" }}
            prefix={<WarningOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Newly At Risk"
            value={3}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
        <Card>
          <Statistic
            title="Improving Students"
            value={7}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Flex>

      <Card title="Student List">
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Search
            placeholder="Search by name or student number..."
            onSearch={(value) => console.log(value)}
            style={{ width: 400 }}
          />

          <Table
            columns={tableColumns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default DashboardPage;

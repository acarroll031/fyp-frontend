import React, { useEffect, useState } from "react";
import { Flex, Card, Statistic, Space, Table, Tag, Input } from "antd";
import type { TableProps } from "antd"; // Import the TableProps type
import { ArrowUpOutlined, WarningOutlined } from "@ant-design/icons";
import axios from "axios";

const { Search } = Input;

interface Student {
  key: string;
  studentNumber: string;
  fullName: string;
  module: string;
  riskScore: number;
  status: "At Risk" | "Improving" | "On Track" | "Newly At Risk";
}

interface StudentResponse {
  student_id: number;
  student_name: string;
  module: string;
  risk_score: number;
}

const module_filters = [
    { text: 'CS161', value: 'CS161' },
    { text: 'CS162', value: 'CS162' },
    { text: 'CS210', value: 'CS210' },
];

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
      sorter: {
          compare: (a, b) => a.module.localeCompare(b.module),
          multiple: 3,
      },
      filters: module_filters,
        onFilter: (value, record) => record.module === value,
  },
  {
    title: "Risk Score",
    dataIndex: "riskScore",
    key: "riskScore",
      sorter: {
          compare: (a, b) => a.riskScore - b.riskScore,
          multiple: 2,
      }
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status) => {
      let color;
      if (status === "At Risk") color = "volcano";
      else if (status === "Improving") color = "green";
      else if (status === "Newly At Risk") color = "orange";
      else color = "geekblue";
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
      sorter: {
          compare: (a, b) => a.status.localeCompare(b.status),
          multiple: 1,
      }
  },
];



const DashboardPage: React.FC = () => {
  const [tableData, setTableData] = useState<Student[]>([]);
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<Student["status"] | null>(null);

  const studentsAtRisk = tableData.filter(
    (student) => student.status === "At Risk",
  ).length;
  const newlyAtRisk = tableData.filter(
    (student) => student.status === "Newly At Risk",
  ).length;
  const improvingStudents = tableData.filter(
    (student) => student.status === "Improving",
  ).length;

  useEffect(() => {
    axios.get("http://localhost:8000/students").then((response) => {
      console.log(response.data);
      const students: Student[] = response.data.map(
        (student: StudentResponse) => ({
          key: student.student_id.toString() + "-" + student.module,
          studentNumber: student.student_id.toString(),
          fullName: student.student_name,
          module: student.module,
          riskScore: student.risk_score,
          status:
            student.risk_score > 70
              ? "At Risk"
              : student.risk_score > 40
                ? "Newly At Risk"
                : student.risk_score > 20
                  ? "Improving"
                  : "On Track",
        }),
      );
      console.log(students);
      setTableData(students);
      setFilteredData(students);
    });
  }, []);

    useEffect(() => {
        let filtered = tableData;

        // Apply search filter
        if (searchValue) {
            filtered = filtered.filter(
                (student) =>
                    student.fullName.toLowerCase().includes(searchValue) ||
                    student.studentNumber.toLowerCase().includes(searchValue),
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter((student) => student.status === statusFilter);
        }

        setFilteredData(filtered);
    }, [tableData, searchValue, statusFilter]);

  const handleSearch = (value: string) => {
    const searchValue = value.toLowerCase().trim();

    if (!searchValue) {
      setFilteredData(tableData);
      return;
    }

    const filtered = tableData.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchValue) ||
        student.studentNumber.toLowerCase().includes(searchValue),
    );
    setSearchValue(searchValue);
    setFilteredData(filtered);
  };

    const handleStatusFilter = (status: Student["status"]) => {
        setStatusFilter(statusFilter === status ? null : status);
    };
  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Flex gap="large">
        <Card
            hoverable
            onClick={() => handleStatusFilter("At Risk")}
            style={{
                cursor: 'pointer',
                border: statusFilter === "At Risk" ? '2px solid #cf1322' : undefined
            }}>
          <Statistic
            title="Students at Risk"
            value={studentsAtRisk}
            valueStyle={{ color: "#cf1322" }}
            prefix={<WarningOutlined />}
          />
        </Card>
        <Card
            hoverable
            onClick={() => handleStatusFilter("Newly At Risk")}
            style={{
                cursor: 'pointer',
                border: statusFilter === "Newly At Risk" ? '2px solid #cf1322' : undefined
            }}>
          <Statistic
            title="Newly At Risk"
            value={newlyAtRisk}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
        <Card
            hoverable
            onClick={() => handleStatusFilter("Improving")}
            style={{
                cursor: 'pointer',
                border: statusFilter === "Improving" ? '2px solid #cf1322' : undefined
            }}>
          <Statistic
            title="Improving Students"
            value={improvingStudents}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Flex>

      <Card title="Student List">
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Search
            placeholder="Search by name or student number..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            allowClear
            style={{ width: 400 }}
          />

          <Table
            columns={tableColumns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default DashboardPage;

import React, { useEffect, useState } from "react";
import { Flex, Card, Statistic, Space, Table, Tag, Input } from "antd";
import type { TableProps } from "antd"; // Import the TableProps type
import { ArrowUpOutlined, WarningOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const { Search } = Input;

interface Student {
  key: string;
  studentNumber: number;
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

interface Module {
  module_code: string;
  module_name: string;
  assessment_count: number;
}

const DashboardPage: React.FC = () => {
  const [tableData, setTableData] = useState<Student[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<Student["status"] | null>(
    null,
  );
  const [moduleFilters, setModuleFilters] = useState<
    { text: string; value: string }[]
  >([]);
  const navigate = useNavigate();

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
      render: (text, record) => (
        <Link
          to={`/student/${record.studentNumber}`}
          style={{ fontWeight: 500 }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      sorter: {
        compare: (a, b) => a.module.localeCompare(b.module),
        multiple: 3,
      },
      filters: moduleFilters,
      onFilter: (value, record) => record.module === value,
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      key: "riskScore",
      sorter: {
        compare: (a, b) => a.riskScore - b.riskScore,
        multiple: 2,
      },
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
      },
    },
  ];

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
    const fetchModuleFilters = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get<Module[]>(`${API_URL}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filters = response.data.map((module) => ({
          text: module.module_code,
          value: module.module_code,
        }));
        setModuleFilters(filters);
      } catch (error) {
        console.error("Error fetching modules for filters:", error);
      }
    };
    fetchModuleFilters();
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);
        const students: Student[] = response.data
          .map((student: StudentResponse) => ({
            key: student.student_id.toString() + "-" + student.module,
            studentNumber: student.student_id,
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
          }))
          .sort((a: Student, b: Student) => a.studentNumber - b.studentNumber);
        setTableData(students);
      } catch (error) {
        console.error("Error fetching students:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchStudents();
  }, [navigate]);

  const getFilteredData = () => {
    let filtered = tableData;

    if (searchValue) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchValue) ||
          student.studentNumber.toString().includes(searchValue) ||
          student.module.toLowerCase().includes(searchValue),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    return filtered;
  };

  const handleSearch = (value: string) => {
    setSearchValue(value.toLowerCase().trim());
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
            cursor: "pointer",
            border:
              statusFilter === "At Risk" ? "2px solid #1668dc" : undefined,
          }}
        >
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
            cursor: "pointer",
            border:
              statusFilter === "Newly At Risk"
                ? "2px solid #1668dc"
                : undefined,
          }}
        >
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
            cursor: "pointer",
            border:
              statusFilter === "Improving" ? "2px solid #1668dc" : undefined,
          }}
        >
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
            placeholder="Search by name, student number or module"
            onSearch={handleSearch}
            onChange={(e) =>
              setSearchValue(e.target.value.toLowerCase().trim())
            }
            enterButton
            allowClear
            style={{ width: 400 }}
          />

          <Table
            columns={tableColumns}
            dataSource={getFilteredData()}
            pagination={{ pageSize: 20, showSizeChanger: false }}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default DashboardPage;

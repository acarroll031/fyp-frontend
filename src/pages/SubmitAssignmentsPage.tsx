import React, { useEffect, useState } from "react";
import {
  Typography,
  Form,
  Select,
  Upload,
  Button,
  Space,
  Slider,
  App,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;
const { useApp } = App;

interface FormValues {
  moduleCode: string;
  semesterProgress: number;
  csvUpload: UploadFile[];
}

interface Module {
  module_code: string;
  module_name: string;
  assessment_count: number;
}

const uploadProps: UploadProps = {
  accept: ".csv",
  beforeUpload: () => {
    return false;
  },
  maxCount: 1,
};

const API_URL = import.meta.env.VITE_API_URL;

const SubmitAssignmentsPage: React.FC = () => {
  const { message } = useApp();
  const [form] = Form.useForm();
  const [modules, setModules] = useState<Module[]>([]);
  const [maxAssessments, setMaxAssessments] = useState<number>(12);
  const [currentAssessment, setCurrentAssessment] = useState<number>(1);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${API_URL}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModules(response.data);
      } catch (error) {
        console.log("Failed to fetch modules:", error);
        message.error("Could not load your modules.");
      }
    };
    fetchModules().then();
  });

  const handleModuleChange = (value: string) => {
    const selectedModule = modules.find((mod) => mod.module_code === value);

    if (selectedModule) {
      setMaxAssessments(selectedModule.assessment_count);
      setCurrentAssessment(1);
      message
        .info(`Max assessments set to ${selectedModule.assessment_count}`)
        .then();
    }
  };
  const handleSubmit = async (values: FormValues) => {
    console.log("Form Values:", values);
    console.log("Current Step:", currentAssessment);

    const file = values.csvUpload?.[0]?.originFileObj;

    const progress_in_semester = Number(
      currentAssessment / maxAssessments,
    ).toFixed(2);

    console.log("progress_in_semester:", progress_in_semester);

    if (!file) {
      message.error("Please upload a CSV file.");
      return;
    }
    console.log("File to upload:", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${API_URL}/students/${values.moduleCode}/grades?progress_in_semester=${progress_in_semester}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        message.success("Grades submitted successfully!");
        form.resetFields();
      } else {
        message.error("Failed to submit grades. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting grades:", error);
      message.error("An error occurred while submitting grades.");
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>Submit Assessments</Title>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ maxWidth: 650 }}
      >
        <Form.Item
          label="Module Code:"
          name="moduleCode"
          rules={[{ required: true, message: "Please select a module" }]}
        >
          <Select placeholder="Select a module" onChange={handleModuleChange}>
            {modules.map((mod) => (
              <Option key={mod.module_code} value={mod.module_code}>
                {mod.module_code} - {mod.module_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={`Assessment Progress (${currentAssessment}/${maxAssessments}):`}
          name="assessmentStep"
        >
          <Slider
            min={1}
            max={maxAssessments}
            step={1}
            value={currentAssessment}
            onChange={setCurrentAssessment}
            tooltip={{ formatter: (value) => `Assessment ${value}` }}
          />
        </Form.Item>

        <Form.Item
          label="Upload CSV File:"
          name="csvUpload"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Grades
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default SubmitAssignmentsPage;

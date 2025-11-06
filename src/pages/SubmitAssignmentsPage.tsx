import React from "react";
import {
  Typography,
  Form,
  Select,
  Upload,
  Button,
  Space,
  message,
  Slider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Title } = Typography;
const { Option } = Select;

const modules = [
  { code: "CS161", title: "Intro to Programming" },
  { code: "CS162", title: "Data Structures" },
  { code: "CS210", title: "Databases" },
];

const totalSteps = 12;

const uploadProps: UploadProps = {
  name: "file", // The name of the file field in the POST request
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188", // A dummy API endpoint
  headers: {
    authorization: "authorization-text",
  },
  accept: ".csv",
  onChange(info) {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const SubmitAssignmentsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(2);
  const marks = {
    1: "Week 1",
    3: "Week 3",
    6: "Week 6",
    9: "Week 9",
    12: "Week 12",
  };

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>Submit Assessments</Title>

      <Form layout="vertical" style={{ maxWidth: 650 }}>
        <Form.Item
          label="Module Code:"
          name="moduleCode"
          rules={[{ required: true, message: "Please select a module" }]}
        >
          <Select placeholder="Select a module">
            {modules.map((mod) => (
              <Option key={mod.code} value={mod.code}>
                {mod.code} - {mod.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Progress in Semester:" name="semesterProgress">
          <Slider
            min={1}
            max={totalSteps}
            marks={marks}
            value={currentStep + 1}
            onChange={(value) => setCurrentStep(value - 1)}
          />
        </Form.Item>

        <Form.Item
          label="Upload CSV File:"
          name="csvUpload"
          valuePropName="fileList"
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

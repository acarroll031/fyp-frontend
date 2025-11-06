import React from "react";
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

const { Title } = Typography;
const { Option } = Select;
const { useApp } = App;

const modules = [
  { code: "CS161", title: "Intro to Programming" },
  { code: "CS162", title: "Data Structures" },
  { code: "CS210", title: "Databases" },
];

const totalSteps = 12;

interface FormValues {
  moduleCode: string;
  semesterProgress: number;
  csvUpload: UploadFile[];
}

const uploadProps: UploadProps = {
  accept: ".csv",
  beforeUpload: () => {
    return false;
  },
  maxCount: 1,
};

const SubmitAssignmentsPage: React.FC = () => {
  const { message } = useApp();
  const [currentStep, setCurrentStep] = React.useState(2);
  const marks = {
    1: "Week 1",
    3: "Week 3",
    6: "Week 6",
    9: "Week 9",
    12: "Week 12",
  };
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormValues) => {
    console.log("Form Values:", values);
    console.log("Current Step:", currentStep);

    const file = values.csvUpload?.[0]?.originFileObj;

    const progress_in_semester = Number((currentStep + 1) / totalSteps).toFixed(
      2,
    );

    if (!file) {
      message.error("Please upload a CSV file.");
      return;
    }
    console.log("File to upload:", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8000/students/${values.moduleCode}/grades?progress_in_semester=${progress_in_semester}`,
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

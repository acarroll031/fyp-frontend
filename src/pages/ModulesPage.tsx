import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

interface Module {
  module_code: string;
  module_name: string;
  assessment_count: number;
}

const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/modules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(response.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch modules");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleAdd = () => {
    setEditingModule(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Module) => {
    setEditingModule(record);
    // Map backend fields to form fields
    form.setFieldsValue({
      module_code: record.module_code,
      module_name: record.module_name,
      assessment_count: record.assessment_count,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (module_code: string) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/modules/${module_code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Module deleted");
      fetchModules();
    } catch (error) {
      console.log(error);
      message.error("Failed to delete module");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      if (editingModule) {
        await axios.put(
          `http://localhost:8000/modules/${editingModule.module_code}`,
          values,
          { headers },
        );
        message.success("Module updated");
      } else {
        // CREATE Logic
        await axios.post("http://localhost:8000/modules", values, { headers });
        message.success("Module created");
      }

      setIsModalOpen(false);
      fetchModules();
    } catch (error) {
      console.log(error);
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Code", dataIndex: "module_code", key: "code" },
    { title: "Name", dataIndex: "module_name", key: "name" },
    { title: "Assessments", dataIndex: "assessment_count", key: "count" },
    {
      title: "Actions",
      key: "action",
      render: (_: unknown, record: Module) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Delete this module?"
            onConfirm={() => handleDelete(record.module_code)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Your Modules"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Module
        </Button>
      }
    >
      <Table dataSource={modules} columns={columns} rowKey="module_code" />

      <Modal
        title={editingModule ? "Edit Module" : "Create Module"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        destroyOnHidden={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="module_code"
            label="Module Code"
            rules={[{ required: true }]}
          >
            <Input disabled={!!editingModule} />
          </Form.Item>
          <Form.Item
            name="module_name"
            label="Module Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="assessment_count"
            label="Number of Assessments"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={50} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ModulesPage;

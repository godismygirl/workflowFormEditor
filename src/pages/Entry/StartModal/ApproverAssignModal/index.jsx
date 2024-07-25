import React from 'react';
import { Modal, Form, Select } from 'antd';
import EmployeePicker from '@/comps/EmployeePicker';

const ApproverAssignModal = ({ open, approvers, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const save = async () => {
    const formData = await form.validateFields();
    onCancel();
    onSuccess({ nextApprovers: formData.assign });
  };

  return (
    <Modal
      title="发起申请"
      open={open}
      centered
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={save}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="assign" label="请先选择下一节点审批人">
          {approvers?.length > 0 ? (
            <Select
              options={approvers?.map((el) => ({
                label: el.name,
                value: el.id,
              }))}
            />
          ) : (
            <EmployeePicker multiple />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApproverAssignModal;

import React, { useState } from 'react';
import { request, useModel } from 'umi';
import { Form, Input, message } from 'antd';
import { Modal } from 'antd';

const PersonalInfo = ({ name }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { fetchUserInfo } = useModel('useUser');

  const save = async () => {
    const formData = await form.validateFields();
    try {
      setLoading(true);
      const res = await request('./API/security/usernames/change', {
        method: 'put',
        data: { name: formData.name },
      });
      setLoading(false);
      if (res.errCode === '0000') {
        message.success('修改个人信息成功');
        setOpen(false);
        fetchUserInfo();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <a onClick={() => setOpen(true)}>个人信息</a>
      <Modal
        open={open}
        title="个人信息"
        okText="保存"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={save}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '姓名必填' }]}
            initialValue={name}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          {/* <Form.Item label="头像" name="avatar"></Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(PersonalInfo);

import React, { useState } from 'react';
import { useModel, request } from 'umi';
import { Modal, Form, Select, message, Button } from 'antd';
import styles from './styles.less';

const ChangeOrg = ({ orgList }) => {
  const { userInfo } = useModel('useUser');

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const getDefaultOrg = () => {
    const org = userInfo?.employeeInfoList?.find((el) => el.defaultOrg);
    return org?.orgId;
  };

  const save = async () => {
    const formData = await form.validateFields();
    try {
      setLoading(true);
      const res = await request('./API/security/default-orgs/change', {
        method: 'put',
        data: { orgId: formData.orgId },
      });
      setLoading(false);
      if (res.errCode === '0000') {
        message.success('修改主企业成功，重新登录以激活');
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.switchBox}>
        <Button type="primary" ghost block onClick={() => setOpen(true)}>
          更换主企业
        </Button>
      </div>
      <Modal
        title="更换主企业"
        open={open}
        okText="保存"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={save}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="orgId"
            label="选择主企业"
            rules={[{ required: true, message: '单位必选' }]}
            initialValue={getDefaultOrg()}
          >
            <Select options={orgList} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(ChangeOrg);

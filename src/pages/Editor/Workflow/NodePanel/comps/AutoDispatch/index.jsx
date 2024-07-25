import React, { useState, useEffect } from 'react';
import { Radio, Tooltip, Form } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import EmployeePicker from '@/comps/EmployeePicker';
import styles from './styles.less';

//数据格式 {toAdmin:Boolean, users:[]}
const AutoDispatch = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [radioVal, setRadioVal] = useState();

  useEffect(() => {
    if (value) {
      setRadioVal(value.toAdmin ? 'toAdmin' : 'else');
      if (value?.users) {
        form.setFieldsValue({ users: value.users });
      }
    }
  }, [value]);

  return (
    <Form form={form}>
      <div className={styles.sectionHeader}>审批人为空时</div>
      <Radio.Group
        value={radioVal}
        style={{ width: '100%' }}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'toAdmin') {
            onChange?.({ toAdmin: true, users: undefined });
          } else {
            onChange?.();
          }
          setRadioVal(val);
          setTimeout(() => {
            form.validateFields();
          }, 0);
        }}
      >
        <div className={styles.row}>
          <Radio value="toAdmin">自动转交单位管理员</Radio>
          <Tooltip
            placement="top"
            title="单位管理员可在【单位管理】中设置或查看"
          >
            <i className={styles.info}>
              <ExclamationCircleFilled />
            </i>
          </Tooltip>
        </div>
        <div className={styles.row} style={{ paddingBottom: 8 }}>
          <Radio value="else">指定审批人员</Radio>
          {radioVal === 'else' && (
            <div className={styles.userBox}>
              <Form.Item name="users" noStyle rules={[{ required: true }]}>
                <EmployeePicker
                  //value={value?.users}
                  onChange={(users) =>
                    onChange?.({
                      toAdmin: false,
                      users,
                    })
                  }
                />
              </Form.Item>
            </div>
          )}
        </div>
      </Radio.Group>
    </Form>
  );
};

export default AutoDispatch;

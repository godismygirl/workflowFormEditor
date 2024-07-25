import React, { useEffect } from 'react';
import { Radio, Select, Form } from 'antd';
import DepartPicker from '@/comps/DepartPicker';
import styles from './styles.less';

const DepartHeadSelect = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const radio = Form.useWatch('radio', form);

  const onFormChange = (changed, formData) => {
    setTimeout(() => {
      form.validateFields();
    }, 0);

    if (changed.radio === 'initiator') {
      form.setFieldsValue({ initiator_head: 'ALL' });
      onChange?.({
        approvalObjects: [{ id: 'initiator', name: '发起人主管' }],
        filter: { departHeadFilter: { type: 'ALL' } },
      });
      return;
    }

    if (changed.initiator_head) {
      onChange?.({
        approvalObjects: [{ id: 'initiator', name: '发起人主管' }],
        filter: { departHeadFilter: { type: changed.initiator_head } },
      });
      return;
    }

    if (changed.radio === 'last_assignee') {
      form.setFieldsValue({ last_assignee_head: 'ALL' });
      onChange?.({
        approvalObjects: [{ id: 'last_assignee', name: '上一节点审批人主管' }],
        filter: { departHeadFilter: { type: 'ALL' } },
      });
      return;
    }

    if (changed.last_assignee_head) {
      onChange?.({
        approvalObjects: [{ id: 'last_assignee', name: '上一节点审批人主管' }],
        filter: { departHeadFilter: { type: changed.last_assignee_head } },
      });
      return;
    }

    if (changed.depart) {
      form.setFieldsValue({ depart_head: 'ALL' });
      onChange?.({
        approvalObjects: formData.depart,
        filter: { departHeadFilter: { type: 'ALL' } },
      });
      return;
    }

    if (changed.depart_head && formData.depart) {
      onChange?.({
        approvalObjects: formData.depart,
        filter: { departHeadFilter: { type: changed.depart_head } },
      });
      return;
    }

    //切到指定部门主管，但没选部门
    if (changed.radio === 'depart_assignee' && !formData?.depart?.length > 0) {
      onChange?.();
      return;
    }
  };

  useEffect(() => {
    if (value?.approvalObjects) {
      const targetId = value.approvalObjects?.[0]?.id;
      if (targetId === 'initiator') {
        form.setFieldsValue({
          radio: targetId,
          initiator_head: value.filter?.departHeadFilter?.type,
        });
      } else if (targetId === 'last_assignee') {
        form.setFieldsValue({
          radio: targetId,
          last_assignee_head: value.filter?.departHeadFilter?.type,
        });
      } else {
        form.setFieldsValue({
          radio: 'depart_assignee',
          depart: value.approvalObjects,
          depart_head: value.filter?.departHeadFilter?.type,
        });
      }
    }
  }, [value]);

  return (
    <Form form={form} onValuesChange={onFormChange}>
      <Form.Item name="radio" noStyle>
        <Radio.Group style={{ width: '100%' }}>
          <div className={styles.row}>
            <Radio value="initiator">
              <span>发起人主管</span>
            </Radio>
            {radio === 'initiator' && (
              <Form.Item name="initiator_head" noStyle initialValue="ALL">
                <Select
                  options={[
                    { label: '所有主管', value: 'ALL' },
                    { label: '主管', value: 'DEPART_HEAD' },
                    { label: '副主管', value: 'DEPART_HEAD_DEPUTY' },
                  ]}
                  style={{ width: 140 }}
                />
              </Form.Item>
            )}
          </div>
          <div className={styles.row}>
            <Radio value="last_assignee">
              <span>上一节点审批人主管</span>
            </Radio>
            {radio === 'last_assignee' && (
              <Form.Item name="last_assignee_head" noStyle initialValue="ALL">
                <Select
                  options={[
                    { label: '所有主管', value: 'ALL' },
                    { label: '主管', value: 'DEPART_HEAD' },
                    { label: '副主管', value: 'DEPART_HEAD_DEPUTY' },
                  ]}
                  style={{ width: 140 }}
                />
              </Form.Item>
            )}
          </div>
          <div className={styles.row}>
            <Radio value="depart_assignee">
              <span>指定部门主管</span>
            </Radio>
            {radio === 'depart_assignee' && (
              <>
                <Form.Item name="depart" noStyle rules={[{ required: true }]}>
                  <DepartPicker style={{ width: 180 }} />
                </Form.Item>
                <Form.Item name="depart_head" noStyle initialValue="ALL">
                  <Select
                    options={[
                      { label: '所有主管', value: 'ALL' },
                      { label: '主管', value: 'DEPART_HEAD' },
                      { label: '副主管', value: 'DEPART_HEAD_DEPUTY' },
                    ]}
                    style={{ width: 140 }}
                  />
                </Form.Item>
              </>
            )}
          </div>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default DepartHeadSelect;

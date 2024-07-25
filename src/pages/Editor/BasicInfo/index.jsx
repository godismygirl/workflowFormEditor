import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Input, TimePicker } from 'antd';
import OrgPicker from '@/comps/OrgPicker';
import IconSelect from '@/comps/IconSelect';
import { TAB_KEY } from '..';
import KeyInfoSelect from './KeyInfoSelect';
import styles from './styles.less';

const BasicInfo = ({ data }) => {
  const [form] = Form.useForm();
  const { update } = useModel('useAppHeader');
  const { open, updateResult, updateStatus } = useModel('useSaveProgress');

  const validate = async () => {
    try {
      const formData = await form.getFieldsValue();

      console.log(formData.remark);
      updateStatus({
        [TAB_KEY.BASIC]: 'finish',
      });

      updateResult({
        [TAB_KEY.BASIC]: {
          name: formData.name,
          props: formData.icon,
          remark: formData.remark,
          approvalObjects: formData.approvalObjects,
          tagFieldId: formData.tagFieldId,
        },
      });
    } catch (error) {
      console.error(error);
      updateStatus({
        [TAB_KEY.BASIC]: 'error',
      });
    }
  };

  useEffect(() => {
    //打开保存窗时校验
    if (open) {
      validate();
    }
  }, [open]);

  useEffect(() => {
    if (data?.name) {
      const touched = form.isFieldTouched('name');
      if (!touched) {
        form.setFieldsValue(data);
      }
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ icon: { hex: '#1677ff' } }}
      >
        <Form.Item name="icon" label="表单图标">
          <IconSelect
            onChange={(v) => {
              if (v.name && v.hex) {
                update({ icon: v });
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="表单名称"
          rules={[{ required: true, message: '表单名称必填' }]}
        >
          <Input
            placeholder="请输入"
            onChange={(e) => update({ name: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label={
            <>
              设置发起人
              <span className={styles.addon}>
                【选择能发起该审批的单位，不选则默认开放给创建单位】
              </span>
            </>
          }
          name="approvalObjects"
        >
          <OrgPicker multiple />
        </Form.Item>
        {/* <Form.Item label="是否支持关键信息自定义" name="tagFieldId">
          <KeyInfoSelect />
        </Form.Item> */}
        <Form.Item
          name="remark"
          label="备注说明"
          //rules={[{ required: true, message: '备注说明必填' }]}
        >
          <Input.TextArea placeholder="请输入" rows={3} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(BasicInfo);

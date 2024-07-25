import React from 'react';
import { useLocation } from 'umi';
import { parse } from 'query-string';
import SearchPreview from '@/pages/Editor/ColumnDesign/SearchPreview';
import OrgPicker from '@/comps/OrgPicker';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { Form, Space, Button, Input, Select, DatePicker } from 'antd';
import styles from './styles.less';

const Filter = ({ fields, onChange, onExportExcel }) => {
  const { search } = useLocation();
  const query = parse(search);
  const [form] = Form.useForm();

  const submit = () => {
    const formData = form.getFieldsValue();

    let customQueries = {};
    Object.keys(formData).map((k) => {
      if (
        k !== 'processStatus' &&
        k !== 'initiatorOrgId' &&
        k !== 'startTime'
      ) {
        customQueries[k] = formData[k];
      }
    });

    onChange?.({
      processStatus: formData.processStatus ?? query.status,
      initiatorOrgId: formData.initiatorOrgId?.[0]?.id,
      startTime: formData.startTime && [
        formData.startTime[0]?.format('YYYY-MM-DD'),
        formData.startTime[1]?.format('YYYY-MM-DD'),
      ],
      customQueries,
    });
  };

  return (
    <div className={styles.filter}>
      <div className={styles.formArea}>
        <Form form={form} layout="inline">
          {!query.hideStatus && (
            <Form.Item
              label="审批状态"
              name="processStatus"
              initialValue={query.status ?? ''}
            >
              <Select
                options={[
                  { label: '全部', value: '' },
                  { label: '处理中', value: 'PROCESSING' },
                  { label: '已完成', value: 'COMPLETED' },
                  { label: '已拒绝', value: 'DENIED ' },
                ]}
                style={{ width: 100 }}
              />
            </Form.Item>
          )}
          <Form.Item
            label="发起人单位"
            name="initiatorOrgId"
            rules={[{ required: true }]}
          >
            <OrgPicker style={{ width: 200 }} autoSelect onload={submit} />
          </Form.Item>
          <Form.Item label="申请人" name="initiator">
            <Input />
          </Form.Item>
          <Form.Item label="申请时间" name="startTime">
            <DatePicker.RangePicker locale={locale} />
          </Form.Item>
          <SearchPreview columns={fields} />
        </Form>
      </div>
      <Space className={styles.btnArea}>
        <Button
          onClick={() => {
            form.resetFields();
            submit();
          }}
        >
          清除
        </Button>
        <Button type="primary" onClick={submit}>
          搜索
        </Button>
        <Button type="primary" ghost onClick={onExportExcel}>
          导出
        </Button>
      </Space>
    </div>
  );
};

export default React.memo(Filter);

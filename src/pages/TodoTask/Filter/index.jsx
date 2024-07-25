import OrgPicker from '@/comps/OrgPicker';
import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import EmployeePicker from '@/comps/EmployeePicker';
import 'dayjs/locale/zh-cn';
import React, { useEffect } from 'react';
import { parse } from 'query-string';
import { useLocation } from 'umi';
import styles from './styles.less';

dayjs.locale('zh-cn');

const Filter = ({ onFilterChange, hideTimeRange, hideInitiator }) => {
  const { search } = useLocation();
  const query = parse(search);
  const [form] = Form.useForm();

  const onSearch = () => {
    const formData = form.getFieldsValue();
    let appIds = [];

    if (formData.appIds) {
      if (formData.appIds?.startsWith('[')) {
        const result = JSON.parse(formData.appIds);
        appIds = result;
      } else {
        appIds.push(formData.appIds);
      }
    }

    onFilterChange?.({
      initiatorOrgId: formData.org?.[0]?.id,
      appIds,
      initiator: formData?.initiator?.[0]?.id,
      startTimeBegin: formData?.date?.[0],
      startTimeEnd: formData?.date?.[1],
    });
  };

  const getInitAll = () => {
    const options = JSON.parse(query.apps);
    return options[0].value;
  };

  return (
    <div className={styles.box}>
      <Form form={form} layout="inline" style={{ flexGrow: 1 }}>
        <Form.Item name="org" label="单位">
          <OrgPicker autoSelect onload={onSearch} style={{ width: 220 }} />
        </Form.Item>
        {query?.apps && (
          <Form.Item name="appIds" label="应用类型" initialValue={getInitAll()}>
            <Select options={JSON.parse(query.apps)} style={{ width: 120 }} />
          </Form.Item>
        )}
        {!hideInitiator && (
          <Form.Item name="initiator" label="发起人">
            <EmployeePicker style={{ width: 150 }} />
          </Form.Item>
        )}

        {!hideTimeRange && (
          <Form.Item name="date" label="发起时间">
            <DatePicker.RangePicker locale={locale} />
          </Form.Item>
        )}
      </Form>
      <Space>
        <Button
          onClick={() => {
            form.resetFields();
            onSearch();
          }}
        >
          重置
        </Button>
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
      </Space>
    </div>
  );
};

export default React.memo(Filter);

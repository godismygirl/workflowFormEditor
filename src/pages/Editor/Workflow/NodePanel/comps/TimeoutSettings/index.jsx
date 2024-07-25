import React, { useState } from 'react';
import { Switch, InputNumber, Space, Select } from 'antd';
import styles from './styles.less';

//数据结构
//{timeUnit, period}

const TimeoutSettings = ({ value, onChange }) => {
  const getMax = () => {
    let max = 30;
    if (value?.timeUnit === 'HOUR') {
      max = 24;
    }
    if (value?.timeUnit === 'MINUTE') {
      max = 60;
    }
    return max;
  };

  const onGlobalToggle = (checked) => {
    if (!checked) {
      onChange?.();
      return;
    }
    //打开时默认选中1天
    onChange?.({
      timeUnit: 'DAY',
      period: 1,
      noticeRequired: false,
    });
  };

  const onUnitChange = (unit) => {
    let max = 60;
    switch (unit) {
      case 'DAY':
        max = 30;
        break;
      case 'HOUR':
        max = 24;
        break;
      case 'MINUTE':
        max = 60;
        break;
      default:
    }

    if (value?.period > max) {
      onChange({
        ...value,
        timeUnit: unit,
        period: max,
      });
    } else {
      onChange({
        ...value,
        timeUnit: unit,
      });
    }
  };

  return (
    <div style={{ marginBottom: 15 }}>
      <div className={styles.sectionHeader}>审批超时设置</div>
      <div className={styles.row}>
        <span className={styles.title}>超时计时规则</span>
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onChange={onGlobalToggle}
          checked={!!value}
        />
      </div>
      {value && (
        <>
          <div className={styles.row}>
            <span className={styles.title}>审批人达到</span>
            <Space.Compact style={{ width: 200 }}>
              <InputNumber
                min={1}
                max={getMax()}
                style={{ width: '50%' }}
                value={value?.period ?? 1}
                onChange={(v) => onChange?.({ ...value, period: v })}
              />
              <Select
                value={value?.timeUnit}
                onChange={onUnitChange}
                style={{ width: '50%' }}
                options={[
                  { label: '天', value: 'DAY' },
                  { label: '小时', value: 'HOUR' },
                  { label: '分', value: 'MINUTE' },
                ]}
              />
            </Space.Compact>
            <span style={{ marginLeft: 8 }}>未处理时，转超时流程</span>
          </div>
          <div className={styles.row}>
            <span className={styles.title}>跳转超时流程后自动推送提醒</span>
            <Switch
              checked={!!value?.noticeRequired}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={(checked) =>
                onChange?.({ ...value, noticeRequired: checked })
              }
            />
            <span className={styles.desc}>
              开启后自动向新审批人推送提醒消息
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeoutSettings;

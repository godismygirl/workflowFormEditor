import React from 'react';
import { Row, Col, Form, Button, Space } from 'antd';
import * as DeskComps from './DesktopComps';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  COMP_NAMES_MAP,
  COMP_NAMES,
  CATEGORY,
} from '@/pages/Editor/AuditForm/consts';
import FormList from './FormList';
import dayjs from 'dayjs';
import styles from './styles.less';

const DesktopRender = ({ layout, cols, form, fieldConfigs, readOnly }) => {
  const colSpan = 24 / cols;

  const behavior = (id) => {
    if (readOnly) return 'READONLY';
    const target = fieldConfigs?.find((el) => el.fieldId === id);
    if (!target) {
      console.error('field config 未找到');
    }
    return target?.fieldBehavior ?? 'NOMARL';
  };

  return (
    <Form form={form} layout="vertical" preserve={false}>
      <Row gutter={50}>
        {layout?.map((el) => {
          const config = behavior(el.id);

          if (el.category === CATEGORY.UI) {
            const Comp = DeskComps[COMP_NAMES_MAP[el.type]];

            return (
              config !== 'HIDDEN' && (
                <Col span={colSpan} key={el.id}>
                  <Comp
                    key={el.id}
                    readOnly={config === 'READONLY'}
                    {...el.attrs}
                  />
                </Col>
              )
            );
          }

          if (el.type === COMP_NAMES.GROUP) {
            return (
              <Col span={colSpan} key={el.id}>
                <Form.Item name={el.id} label={el.attrs?.label}>
                  <FormList
                    readOnly={config === 'READONLY'}
                    innerlist={el.children}
                  />
                </Form.Item>
              </Col>
            );
          }

          if (el.type === COMP_NAMES.SECTION) {
            return (
              <Col span={colSpan} key={el.id}>
                <div className={styles.group}>
                  <div className={styles.header}>{el.attrs?.label}</div>
                  <div className={styles.body}>
                    {el?.children?.map((c) => {
                      const config = behavior(c.id);
                      const Comp = DeskComps[COMP_NAMES_MAP[c.type]];
                      //给datePicker加上当前时间默认值
                      const isDatePicker = c.type === COMP_NAMES.DATE_PICKER;
                      return (
                        config !== 'HIDDEN' && (
                          <Form.Item
                            key={c.id}
                            label={c.attrs?.label}
                            name={c.id}
                            rules={[
                              {
                                required: c.attrs?.required,
                                message: '必填',
                              },
                            ]}
                            initialValue={
                              c.attrs?.value ||
                              (isDatePicker
                                ? dayjs().format('YYYY-MM-DD HH:mm:ss')
                                : undefined)
                            }
                          >
                            <Comp
                              {...c.attrs}
                              readOnly={config === 'READONLY'}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        )
                      );
                    })}
                  </div>
                </div>
              </Col>
            );
          }

          const Comp = DeskComps[COMP_NAMES_MAP[el.type]];
          //给datePicker加上当前时间默认值
          const isDatePicker = el.type === COMP_NAMES.DATE_PICKER;

          return (
            config !== 'HIDDEN' && (
              <Col span={colSpan} key={el.id}>
                <Form.Item
                  label={el.attrs?.label}
                  name={el.id}
                  rules={[{ required: el.attrs?.required, message: '必填' }]}
                  initialValue={
                    el.attrs?.value ||
                    (isDatePicker
                      ? dayjs().format('YYYY-MM-DD HH:mm:ss')
                      : undefined)
                  }
                >
                  <Comp
                    {...el.attrs}
                    readOnly={config === 'READONLY'}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            )
          );
        })}
      </Row>
    </Form>
  );
};

export default DesktopRender;

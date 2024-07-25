import ActionProvider from '../ActionProvider';
import { Radio as AntRadio, Space, Select } from 'antd';
import styles from './styles.less';

const Radio = ({
  id,
  type,
  category,
  attrs,
  inDragProcess,
  ActionProvider,
}) => {
  return (
    <ActionProvider
      id={id}
      type={type}
      category={category}
      attrs={attrs}
      inDragProcess={inDragProcess}
    >
      <div className={styles.radioContent}>
        {attrs.direction === 'dropdown' ? (
          <Select
            value={attrs.value}
            options={attrs.options}
            disabled={attrs.status === 'disabled'}
            style={{ width: '100%' }}
          />
        ) : (
          <AntRadio.Group
            value={attrs.value}
            disabled={attrs.status === 'disabled'}
          >
            <Space direction={attrs.direction}>
              {attrs.options.map((el, index) => {
                return (
                  <div key={index}>
                    <AntRadio value={el.value}>{el.label}</AntRadio>
                    {/* {el.desc && (
                    <div className={styles.descRow}>
                      <Input placeholder="备注" />
                    </div>
                  )} */}
                  </div>
                );
              })}
            </Space>
          </AntRadio.Group>
        )}
      </div>
    </ActionProvider>
  );
};

export default Radio;

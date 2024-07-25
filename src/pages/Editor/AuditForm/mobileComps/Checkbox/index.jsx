import ActionProvider from '../ActionProvider';
import { Checkbox as AntCheckbox, Space } from 'antd';
import styles from './styles.less';

const Checkbox = ({
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
        <AntCheckbox.Group
          value={attrs.value}
          disabled={attrs.status === 'disabled'}
        >
          <Space direction={attrs.direction}>
            {attrs.options.map((el, index) => (
              <AntCheckbox key={index} value={el.value}>
                {el.label}
              </AntCheckbox>
            ))}
          </Space>
        </AntCheckbox.Group>
      </div>
    </ActionProvider>
  );
};

export default Checkbox;

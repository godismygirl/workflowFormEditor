import ActionProvider from '../ActionProvider';
import { DownOutlined } from '@ant-design/icons';
import styles from './styles.less';

const H5Select = ({
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
      <div className={styles.selectContent}>
        <i className={styles.icon}>
          <DownOutlined />
        </i>
        {attrs.value ? (
          attrs.value
        ) : (
          <span className={styles.placeholder}>{attrs.placeholder}</span>
        )}
      </div>
    </ActionProvider>
  );
};

export default H5Select;

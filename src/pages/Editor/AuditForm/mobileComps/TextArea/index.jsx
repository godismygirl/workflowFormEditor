import ActionProvider from '../ActionProvider';
import { Input } from 'antd';
import styles from './styles.less';

const H5TextArea = ({
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
      <textarea
        readOnly
        className={styles.textAreaContent}
        rows={4}
        value={attrs.value}
        placeholder={attrs.placeholder}
        style={{
          fontSize: attrs.fontSize,
        }}
      />
    </ActionProvider>
  );
};

export default H5TextArea;

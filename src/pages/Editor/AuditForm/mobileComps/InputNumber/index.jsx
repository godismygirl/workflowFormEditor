import ActionProvider from '../ActionProvider';
import styles from './styles.less';

const InputNumber = ({
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
      <input
        type="number"
        readOnly
        className={styles.h5InputContent}
        value={attrs.preview ? '${绑定数据源}' : attrs.value}
        placeholder={attrs.placeholder}
      />
    </ActionProvider>
  );
};

export default InputNumber;

import ActionProvider from '../ActionProvider';
import styles from './styles.less';

const H5Input = ({
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
        type="text"
        readOnly
        className={styles.h5InputContent}
        value={attrs.preview ? '${绑定数据源}' : attrs.value}
        placeholder={attrs.placeholder}
      />
    </ActionProvider>
  );
};

export default H5Input;

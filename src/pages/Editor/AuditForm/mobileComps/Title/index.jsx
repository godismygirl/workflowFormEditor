import ActionProvider from '../ActionProvider';
import styles from './styles.less';

const H5Title = ({
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
      <div
        className={styles.title}
        style={{ fontSize: attrs.fontSize, textAlign: attrs.textAlign }}
      >
        {attrs.value}
      </div>
    </ActionProvider>
  );
};

export default H5Title;

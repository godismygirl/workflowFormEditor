import ActionProvider from '../ActionProvider';
import styles from './styles.less';

const H5Text = ({
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
      <div className={styles.text} style={{ fontSize: attrs.fontSize }}>
        {attrs.value}
      </div>
    </ActionProvider>
  );
};

export default H5Text;

import ActionProvider from '../ActionProvider';
import { Divider } from 'antd';
import styles from './styles.less';

const H5Divider = ({
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
      <Divider {...attrs}>{attrs.value}</Divider>
    </ActionProvider>
  );
};

export default H5Divider;

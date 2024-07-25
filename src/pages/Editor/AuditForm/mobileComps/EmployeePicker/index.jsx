import ActionProvider from '../ActionProvider';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './styles.less';

const DepartPicker = ({
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
      <Input
        suffix={<SearchOutlined />}
        readOnly
        placeholder={attrs.placeholder}
      />
    </ActionProvider>
  );
};

export default DepartPicker;

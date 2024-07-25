import { PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import ActionProvider from '../ActionProvider';
import styles from './styles.less';

const ImagePicker = ({
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
      <div style={{ pointerEvents: 'none', paddingBottom: 10 }}>
        <Switch
          defaultChecked
          checkedChildren="允许上传"
          unCheckedChildren="禁止上传"
        />
      </div>
      <div className={styles.upload}>
        <div>
          <PlusOutlined />
        </div>
        <div className={styles.text}>{attrs?.placeholder ?? '上传'}</div>
      </div>
    </ActionProvider>
  );
};

export default ImagePicker;

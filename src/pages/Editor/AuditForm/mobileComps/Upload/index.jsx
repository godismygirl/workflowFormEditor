import ActionProvider from '../ActionProvider';
import { Button, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './styles.less';

const Upload = ({
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
      <Button type="primary" ghost icon={<UploadOutlined />} block>
        点击上传
      </Button>
      {attrs.placeholder && (
        <div className={styles.desc}>{attrs.placeholder}</div>
      )}
    </ActionProvider>
  );
};

export default Upload;

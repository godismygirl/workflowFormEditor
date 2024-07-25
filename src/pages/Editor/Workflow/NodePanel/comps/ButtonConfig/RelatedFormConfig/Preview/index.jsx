import React, { useState, useEffect } from 'react';
import { Button, Modal, Radio } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useStore } from '../formStore';
import FormRender from '@/comps/FormRender';
import styles from './styles.less';

const Preview = () => {
  const [open, setOpen] = useState(false);
  const [layoutType, setLayoutType] = useState('DESKTOP');
  const { layout } = useStore();

  useEffect(() => {
    window.getFormLayout = () => {
      return layout;
    };
  }, [layout]);

  return (
    <>
      <Button
        icon={<EyeOutlined />}
        type="link"
        onClick={() => {
          setOpen(true);
          document
            .getElementById('mobilePreviewFrame')
            ?.contentWindow?.location?.reload(true);
        }}
      >
        表单预览
      </Button>
      <Modal
        open={open}
        title="表单预览"
        width="80vw"
        footer={null}
        centered
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <Radio.Group
              options={[
                { label: '桌面端', value: 'DESKTOP' },
                { label: '移动端', value: 'MOBILE' },
              ]}
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => setLayoutType(e.target.value)}
              value={layoutType}
            />
          </div>
          <div className={styles.body}>
            {layoutType === 'MOBILE' ? (
              <div className={styles.mobileBox}>
                <iframe
                  id="mobilePreviewFrame"
                  src="./#/mobile-preview"
                  style={{ width: '100%', height: '100%', border: 0 }}
                ></iframe>
              </div>
            ) : (
              <div className={styles.desktopBox}>
                <FormRender mode={layoutType} layout={layout} cols={2} />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(Preview);

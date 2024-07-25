import React, { useState, useMemo } from 'react';
import { Button, Modal } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import PreviewRender from './PreviewRender';
import testData from './textData';
import styles from './styles.less';

export { PreviewRender };

const PreviewButton = () => {
  const [open, setOpen] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  const initPreview = () => {
    setOpen(true);
    const config = window.luckysheet.toJson();
    const sd = config.data[0];
    console.log(sd);
    setSheetData(sd);
  };

  return (
    <>
      <Button icon={<PrinterOutlined />} type="primary" onClick={initPreview}>
        预览
      </Button>
      <Modal
        open={open}
        title="打印预览"
        zIndex={1005}
        width={970}
        footer={null}
        onCancel={() => setOpen(false)}
        afterClose={() => setSheetData([])}
      >
        <div className={styles.container}>
          <div className={styles.inner}>
            <PreviewRender data={sheetData} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(PreviewButton);

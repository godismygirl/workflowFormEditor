import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import PrintView from './PrintView';

const PrintBtn = ({ processId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        打印表格
      </Button>

      <Modal
        title="打印表格"
        open={open}
        width={970}
        onCancel={() => setOpen(false)}
        styles={{
          body: { padding: 0, height: '75vh', position: 'relative' },
        }}
        footer={null}
      >
        <PrintView processId={processId} />
      </Modal>
    </>
  );
};

export default PrintBtn;

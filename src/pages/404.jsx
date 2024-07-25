import React from 'react';
import { Button, Result } from 'antd';

const PageNotExist = () => (
  <Result
    status="404"
    title="404"
    subTitle="您要访问的页面不存在"
    //extra={<Button type="primary">返回</Button>}
  />
);

export default PageNotExist;

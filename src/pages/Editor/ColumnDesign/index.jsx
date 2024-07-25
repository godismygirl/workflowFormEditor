import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Radio } from 'antd';
import SearchConfig from './SearchConfig';
import TableConfig from './TableConfig';
import SearchPreview from './SearchPreview';
import TablePreview from './TablePreview';
import { TAB_KEY } from '..';
import styles from './styles.less';

const ColumnDesign = ({ data }) => {
  const [activeKey, setActiveKey] = useState('CONDITION');
  const { layout } = useModel('useFormLayout');
  const { updateConfig, initConfig, searchCondition, tableHeadConfig } =
    useModel('useColumnDesign');
  const { open, updateResult, updateStatus } = useModel('useSaveProgress');

  // useEffect(() => {
  //   if (layout) {
  //     updateConfig(layout);
  //   }
  // }, [layout]);

  useEffect(() => {
    if (data) {
      initConfig(data);
    }
  }, [data]);

  useEffect(() => {
    if (open) {
      updateStatus({
        [TAB_KEY.COLUMN]: 'finish',
      });
      updateResult({
        [TAB_KEY.COLUMN]: {
          filterableFields: searchCondition,
          displayableFields: tableHeadConfig,
        },
      });
    }
  }, [open]);

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <div className={styles.conditionArea}>
          <div className={styles.areaTitle}>查询条件</div>
          <Form layout="inline">
            <SearchPreview />
          </Form>
        </div>
        <div className={styles.tableArea}>
          <div className={styles.areaTitle}>列表字段</div>
          <TablePreview />
        </div>
      </div>
      <div className={styles.setting}>
        <div className={styles.tab}>
          <Radio.Group
            value={activeKey}
            onChange={(e) => setActiveKey(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: '查询条件', value: 'CONDITION' },
              { label: '列表字段', value: 'TABLE' },
            ]}
          />
        </div>

        <div className={styles.content}>
          {activeKey === 'CONDITION' ? <SearchConfig /> : <TableConfig />}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ColumnDesign);

import React from 'react';
import { useModel } from 'umi';
import styles from './styles.less';

const TablePreview = () => {
  const { tableHeadConfig } = useModel('useColumnDesign');

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {tableHeadConfig?.map(
              (el) =>
                el.enabled && (
                  <th key={el.id} className={styles.cell}>
                    {el.attrs?.label}
                  </th>
                ),
            )}
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default React.memo(TablePreview);

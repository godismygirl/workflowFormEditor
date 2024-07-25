import React from 'react';
import PageSpin from '@/comps/PageSpin';
import { useRequest, history } from 'umi';
import AppIcon from '@/pages/Entry/AppIcon';
import styles from './styles.less';

const FlowSearch = () => {
  const { data: appList, loading } = useRequest({
    url: './PROD/apps/list',
    method: 'POST',
    data: { active: true },
  });

  return (
    <div className={styles.container}>
      <PageSpin show={loading} />
      <div className={styles.apps}>
        {appList?.map((el) => (
          <div className={styles.appBox} key={el.id}>
            <div className={styles.app}>
              <div className={styles.row}>
                <div
                  className={styles.appIcon}
                  onClick={() =>
                    history.push(`/flow-search-detail?appId=${el.id}`)
                  }
                >
                  <AppIcon name={el.props.name} hex={el.props.hex} />
                </div>
                <div className={styles.appName}>{el.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(FlowSearch);

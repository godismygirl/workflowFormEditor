import React, { useState } from 'react';
import { useRequest, history } from 'umi';
import {
  HighlightOutlined,
  AuditOutlined,
  UserSwitchOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import PageSpin from '@/comps/PageSpin';
import AppIcon from '@/pages/Entry/AppIcon';
import StartModal from '@/pages/Entry/StartModal';
import styles from './styles.less';

const Dashboard = () => {
  const [info, setInfo] = useState({ appId: '', open: false });
  const { data: summary } = useRequest('./PROD/processes/statistics');

  const { data: appList, loading } = useRequest({
    url: './PROD/apps/list',
    method: 'POST',
    data: { active: true },
  });

  return (
    <div className={styles.container}>
      <div className={styles.statistic}>
        <div className={styles.card} onClick={() => history.push('/todo-task')}>
          <div className={styles.left}>
            <div className={styles.title}>待我处理</div>
            <div className={styles.count}>{summary?.pendingCount}</div>
          </div>
          <div className={styles.icon}>
            <HighlightOutlined style={{ color: '#e74c3c' }} />
          </div>
        </div>
        <div className={styles.card} onClick={() => history.push('/init-task')}>
          <div className={styles.left}>
            <div className={styles.title}>我发起的</div>
            <div className={styles.count}>{summary?.initiatedCount}</div>
          </div>
          <div className={styles.icon}>
            <AuditOutlined style={{ color: '#27ae60' }} />
          </div>
        </div>
        <div className={styles.card} onClick={() => history.push('/cc-task')}>
          <div className={styles.left}>
            <div className={styles.title}>抄送我的</div>
            <div className={styles.count}>{summary?.carbonCopyCount}</div>
          </div>
          <div className={styles.icon}>
            <LinkOutlined style={{ color: '#3498db' }} />
          </div>
        </div>
      </div>
      <div className={styles.apps}>
        <PageSpin show={loading} />
        {appList?.map((el) => (
          <div className={styles.appBox} key={el.id}>
            <div className={styles.app}>
              <div className={styles.row}>
                <div
                  className={styles.appIcon}
                  onClick={() => setInfo({ appId: el.id, open: true })}
                >
                  <AppIcon name={el.props.name} hex={el.props.hex} />
                </div>
                <div className={styles.appName}>{el.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <StartModal
        {...info}
        onCancel={() => setInfo({ appId: '', open: false })}
      />
    </div>
  );
};

export default React.memo(Dashboard);

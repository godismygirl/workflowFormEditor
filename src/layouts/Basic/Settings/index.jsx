import React from 'react';
import { useModel } from 'umi';
import { SettingOutlined } from '@ant-design/icons';
import styles from './styles.less';

const Setting = () => {
  const { userInfo } = useModel('useUser');
  const { activeOrg, updateApp } = useModel('useGlobal');
  const { fetchMenus } = useModel('useMenu');

  const target = userInfo?.employeeInfoList?.find(
    (el) => el.orgId === activeOrg?.orgId,
  );

  return (
    <div
      className={styles.setting}
      onClick={() => {
        updateApp({ name: '系统设置' });
        fetchMenus({
          employeeId: target?.id,
          //appId: d?.[0]?.id,
          userId: userInfo.id,
          onlyCommon: true,
        });
      }}
    >
      <SettingOutlined />
    </div>
  );
};

export default React.memo(Setting);

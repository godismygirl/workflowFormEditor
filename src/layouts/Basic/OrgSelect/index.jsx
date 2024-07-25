import React, { useState, useEffect } from 'react';
import { useModel, useRequest, request } from 'umi';
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Drawer, Select, Divider, Modal } from 'antd';
import ChangeOrg from './ChangeOrg';
import styles from './styles.less';

const OrgSelect = () => {
  const [open, setOpen] = useState(false);

  const [orgList, setOrgList] = useState([]);

  const { userInfo } = useModel('useUser');
  const { activeOrg, updateOrg, activeApp, updateApp, appList, updateAppList } =
    useModel('useGlobal');

  const { fetchMenus } = useModel('useMenu');

  const fetchOrderedApps = async (orgId) => {
    const res = await request('./API/app-orders', {
      params: {
        orgId,
        onlyOrdered: true,
        onlyOrderActive: true,
      },
    });

    const appList = res?.data ?? [];
    updateAppList(appList);

    //激活第一个应用
    updateApp(appList?.[0]);
    const target = userInfo?.employeeInfoList?.find((el) => el.orgId === orgId);

    fetchMenus({
      employeeId: target?.id,
      appId: appList?.[0]?.id,
      userId: userInfo.id,
    });

    if (appList.length === 0) {
      Modal.error({
        title: '该单位尚未订阅任何产品',
        content: '请选择其他单位重试',
      });
    }
  };

  useEffect(() => {
    const orgs = userInfo?.employeeInfoList
      ?.filter((el) => el.orgActive)
      ?.map((el) => ({
        label: el.orgName,
        value: el.orgId,
        employeeId: el.id,
        defaultOrg: el.defaultOrg,
      }));
    setOrgList(orgs);

    //刷新时取sessionStorage里的数据优先
    if (activeOrg) return;

    //激活主企业defaultOrg
    let defaultOrg = orgs?.find((el) => el.defaultOrg) ?? orgs?.[0];

    if (defaultOrg) {
      updateOrg({
        orgName: defaultOrg.label,
        orgId: defaultOrg.value,
        employeeId: defaultOrg.employeeId,
      });

      fetchOrderedApps(defaultOrg.value);
    }
  }, []);

  return (
    <>
      <div className={styles.apps}>
        <Button size="small" type="primary" ghost onClick={() => setOpen(true)}>
          切换产品
        </Button>
      </div>
      <div className={styles.orgs}>
        <Select
          value={activeOrg?.orgId}
          options={orgList}
          style={{ width: 200 }}
          onChange={(v, op) => {
            updateOrg({
              orgName: op.label,
              orgId: op.value,
              employeeId: op.employeeId,
            });
            fetchOrderedApps(op.value);
          }}
          dropdownRender={(menu) => (
            <>
              {menu}
              <ChangeOrg orgList={orgList} />
            </>
          )}
        />
      </div>
      <Drawer
        placement="left"
        title="选择产品"
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        bodyStyle={{ padding: '0' }}
        destroyOnClose
      >
        <div className={styles.appList}>
          {appList?.map((el, index) => (
            <div
              key={index}
              className={
                activeApp?.id === el.id ? styles.activeAppItem : styles.appItem
              }
              onClick={() => {
                updateApp(el);

                const target = userInfo?.employeeInfoList?.find(
                  (el) => el.orgId === activeOrg?.orgId,
                );

                fetchMenus({
                  employeeId: target?.id,
                  appId: el.id,
                  userId: userInfo.id,
                });

                setOpen(false);
              }}
            >
              {activeApp?.id === el.id && (
                <i className={styles.checked}>
                  <CheckCircleFilled />
                </i>
              )}

              <div className={styles.logo}></div>
              <div className={styles.content}>
                <div className={styles.title}>{el.name}</div>
                <div className={styles.desc} title={el.introduction}>
                  {el.introduction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default React.memo(OrgSelect);

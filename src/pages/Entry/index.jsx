import React, { useState } from 'react';
import { history, useRequest, useModel } from 'umi';
import { Button, Empty, Dropdown } from 'antd';
import {
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import Page from '@/comps/Page';
import AppIcon from './AppIcon';
import ActiveButton from './ActiveButton';
import StartModal from './StartModal';
import styles from './styles.less';

const Entry = () => {
  const [info, setInfo] = useState({ appId: '', open: false });
  const { data, loading, refresh } = useRequest({
    url: './PROD/apps/list',
    method: 'POST',
    data: { editable: true },
  });

  const { clear } = useModel('useAppHeader');

  return (
    <Page>
      <Page.Header title="流程管理">
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <a
                    onClick={() => {
                      clear();
                      history.push({
                        pathname: '/editor',
                        search: '?hasWorkflow=true',
                      });
                    }}
                  >
                    包含流程
                  </a>
                ),
              },
              {
                key: '2',
                label: (
                  <a
                    onClick={() => {
                      clear();
                      history.push({
                        pathname: '/editor',
                      });
                    }}
                  >
                    不包含流程
                  </a>
                ),
              },
            ],
          }}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
        >
          <Button type="primary">创建应用</Button>
        </Dropdown>
      </Page.Header>
      <Page.Body style={{ background: '#f5f5f5' }}>
        <div className={styles.container}>
          {data?.length === 0 && (
            <div className={styles.empty}>
              <Empty />
            </div>
          )}
          {data?.map((el) => (
            <div className={styles.appBox} key={el.id}>
              <div className={styles.app}>
                <div className={styles.row}>
                  <div className={styles.appIcon}>
                    <AppIcon name={el.props.name} hex={el.props.hex} />
                  </div>
                  <div className={styles.appName}>{el.name}</div>
                </div>
                <div className={styles.desc}>{el.remark ?? '暂无描述'}</div>
                <div className={styles.footer}>
                  <div className={styles.status}>
                    {el?.active ? (
                      <span className={styles.activeTag}>已启用</span>
                    ) : (
                      <span className={styles.inactiveTag}>未启用</span>
                    )}
                  </div>
                  <div className={styles.action}>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'ACTIVE',
                            label: (
                              <ActiveButton
                                appId={el.id}
                                isActive={el.active}
                                onSuccess={refresh}
                              />
                            ),
                            icon: el.active ? (
                              <PauseOutlined />
                            ) : (
                              <CaretRightOutlined />
                            ),
                          },
                          {
                            key: 'EDIT',
                            label: (
                              <a
                                onClick={() =>
                                  history.push(
                                    el.type === 'FLOW_FORM'
                                      ? `/editor?appId=${el?.id}&hasWorkflow=true`
                                      : `/editor?appId=${el?.id}`,
                                  )
                                }
                              >
                                编辑
                              </a>
                            ),
                            icon: <EditOutlined />,
                          },
                        ],
                      }}
                    >
                      <Button type="text" icon={<EllipsisOutlined />} />
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Page.Body>
      <StartModal
        {...info}
        onCancel={() => setInfo({ appId: '', open: false })}
        onSuccess={refresh}
      />
    </Page>
  );
};

export default Entry;

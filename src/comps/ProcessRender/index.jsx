import React, { useEffect } from 'react';
import { request, useRequest } from 'umi';
import {
  UserOutlined,
  PushpinOutlined,
  SendOutlined,
  EllipsisOutlined,
  PaperClipOutlined,
  CloseOutlined,
  RollbackOutlined,
  CheckOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  CheckCircleFilled,
  StopFilled,
  CloseCircleFilled,
  LeftCircleFilled,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Radio, Image, Tag } from 'antd';
import Spinner from '@/comps/Spinner';
import styles from './styles.less';

const ProcessRender = ({ processId, selectable, value, onChange }) => {
  const { data, run: getDetail } = useRequest(
    {
      url: './PROD/processes/details',
      params: { id: processId },
    },
    { manual: true },
  );

  const {
    data: rollbackData,
    run: getRollbackDetail,
    loading,
  } = useRequest(
    {
      url: './PROD/processes/rollbackable-nodes',
      params: { processInstanceId: processId },
    },
    { manual: true },
  );

  // const renderTime = (timeStr) => {
  //   const arr = timeStr?.split(' ');
  //   return (
  //     <div className={styles.timeBox}>
  //       <div className={styles.day}>
  //         {dayjs(arr?.[0], 'YYYY-MM-DD').format('MM-DD')}
  //       </div>
  //       <div className={styles.minute}>{arr?.[1]}</div>
  //     </div>
  //   );
  // };

  const getAvatar = ({ type, status, nodeId }) => {
    if (nodeId === 'START')
      return (
        <i className={styles.avatar} style={{ background: '#666' }}>
          <UserAddOutlined />
        </i>
      );

    switch (type) {
      case 'TASK':
        {
          if (status === 'DENIED') {
            //拒绝
            return (
              <i className={styles.avatar}>
                <UserSwitchOutlined />
                <i className={styles.miniAvatar} style={{ color: '#ff5500' }}>
                  <CloseCircleFilled
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      border: '1px solid #fff',
                    }}
                  />
                </i>
              </i>
            );
          }

          if (status === 'ROLLBACK') {
            //驳回
            return (
              <i className={styles.avatar}>
                <UserSwitchOutlined />
                <i className={styles.miniAvatar} style={{ color: '#f39c12' }}>
                  <LeftCircleFilled
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      border: '1px solid #fff',
                    }}
                  />
                </i>
              </i>
            );
          }

          if (status === 'DELETED') {
            //撤销
            return (
              <i className={styles.avatar}>
                <UserSwitchOutlined />
                <i className={styles.miniAvatar} style={{ color: '#777' }}>
                  <StopFilled
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      border: '1px solid #fff',
                    }}
                  />
                </i>
              </i>
            );
          }

          if (status === 'PROCESSING') {
            //过程中
            return (
              <i className={styles.avatar} style={{ background: '#f39c12' }}>
                <EllipsisOutlined />
              </i>
            );
          }

          if (status === 'COMPLETED') {
            //通过了
            return (
              <i className={styles.avatar}>
                <UserSwitchOutlined />
                <i className={styles.miniAvatar} style={{ color: '#27ae60' }}>
                  <CheckCircleFilled
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      border: '1px solid #fff',
                    }}
                  />
                </i>
              </i>
            );
          }
        }
        break;

      case 'CC':
        {
          return (
            <i className={styles.avatar}>
              <PaperClipOutlined />
            </i>
          );
        }
        break;

      default:
    }
  };

  const renderEndIcon = (status) => {
    switch (status) {
      case 'DISCARDED':
      case 'DELETED':
        return (
          <i className={styles.avatar} style={{ background: '#666' }}>
            <RollbackOutlined />
          </i>
        );

      case 'DENIED':
        return (
          <i className={styles.avatar} style={{ background: '#ff5500' }}>
            <CloseOutlined />
          </i>
        );

      case 'PROCESSING':
        return (
          <i className={styles.avatar} style={{ background: '#f39c12' }}>
            <EllipsisOutlined />
          </i>
        );

      case 'COMPLETED':
        return (
          <i className={styles.avatar} style={{ background: '#27ae60' }}>
            <CheckOutlined />
          </i>
        );

      default:
    }
  };

  const renderEndText = (status) => {
    switch (status) {
      case 'DELETED':
        return '已撤销';

      case 'DENIED':
        return '已拒绝';

      case 'PROCESSING':
        return '审批中';

      case 'COMPLETED':
        return '已完成';

      case 'DISCARDED':
        return '已废弃';

      default:
    }
  };

  const canRollback = (nodeId) => {
    return rollbackData?.findIndex((el) => el.nodeId === nodeId) !== -1;
  };

  const renderSubValue = (value, type) => {
    if (typeof value == 'string') return value;
    if (Array.isArray(value)) {
      if (type === 'IMAGE_PICKER' || type === 'UPLOAD') {
        return (
          <>
            {value?.map((el, i) => (
              <a
                key={i}
                className={styles.link}
                href={`./FILE/files/preview?id=${el.id}`}
              >
                {el.name}
              </a>
            ))}
          </>
        );
      }

      return value.map((el) => el.name).join('，');
    }
  };
  // COMPLETED: 'COMPLETED', //完成
  // PROCESSING: 'PROCESSING', //处理中
  // DELETED: 'DELETED', //已撤回
  // DENIED: 'DENIED', //已拒绝
  // DISCARDED: 'DISCARDED', //已废弃
  const renderStatusText = (status, isStart) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span style={{ color: '#27ae60' }}>
            {isStart ? '重新提交' : '同意'}
          </span>
        );
      // case 'PROCESSING':
      //   return <span style={{ color: '#1677ff' }}>处理中</span>;
      case 'ROLLBACK':
        return <span style={{ color: '#f39c12' }}>驳回</span>;
      case 'FORWARDED':
        return <span style={{ color: '#27ae60' }}>转交</span>;
      case 'DELETED':
        return <span style={{ color: '#7f8c8d' }}>撤销</span>;
      case 'DENIED':
        return <span style={{ color: '#e74c3c' }}>拒绝</span>;
      case 'DISCARDED':
        return <span style={{ color: '#7f8c8d' }}>废弃</span>;
      default:
    }
  };

  useEffect(() => {
    if (processId) {
      getDetail();
      if (selectable) {
        getRollbackDetail();
      }
    }
  }, [processId]);

  return (
    <div className={styles.container}>
      <Spinner show={loading} />
      <Radio.Group
        style={{ display: 'block' }}
        value={value}
        onChange={onChange}
      >
        {data?.processInstance?.tasks?.map(
          (el, index) =>
            el.nodeType !== 'CONNECTOR' && (
              <div className={styles.row} key={index}>
                {selectable && (
                  <div className={styles.radioCol}>
                    {canRollback(el.nodeId) && (
                      <Radio value={el.nodeId}></Radio>
                    )}
                  </div>
                )}

                {/* <div className={styles.time}>
                  {el?.endTime ? (
                    renderTime(el.endTime)
                  ) : (
                    <div className={styles.timeBox}>
                      <div className={styles.day}>处理中</div>
                    </div>
                  )}
                </div> */}
                <div className={styles.icon}>
                  {getAvatar({
                    type: el.nodeType,
                    status: el.status,
                    nodeId: el.nodeId,
                  })}
                </div>
                <div className={styles.user}>
                  <div className={styles.nodeName} title={el?.name}>
                    {el?.name}
                    {/* {renderStatus(el?.status)} */}
                  </div>
                  {el?.details?.map((d, k) => (
                    <>
                      <div className={styles.userRow} key={k}>
                        <div className={styles.userSummary}>
                          <div className={styles.char}>{d?.assignee?.name}</div>
                          <div className={styles.stat}>
                            {index > 0 &&
                              renderStatusText(
                                d?.status,
                                el?.nodeId === 'START',
                              )}
                          </div>
                          <div className={styles.charTime}>{d?.endTime}</div>
                        </div>

                        {d.comments?.map((c, i) => (
                          <>
                            {c.commentType === 'SIGNATURE' ? (
                              <div className={styles.sign} key={i}>
                                <Image src={c.content} height={40} />
                              </div>
                            ) : (
                              <div className={styles.comment} key={i}>
                                {c.content}
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                      {d?.forwardUser && (
                        <div className={styles.subBox}>
                          <div className={styles.forwardRow}>
                            已转交 <span>{d?.forwardUser?.name}</span>
                          </div>
                        </div>
                      )}
                      {d.subForms?.length > 0 && (
                        <div className={styles.subBox}>
                          {d.subForms?.map((s) => {
                            return s?.subFormItems?.map((item, i) => (
                              <div key={i} className={styles.subRow}>
                                <div className={styles.subLabel}>
                                  {item.label}
                                </div>
                                <div className={styles.subContent}>
                                  {renderSubValue(item.value, item.fieldType)}
                                </div>
                              </div>
                            ));
                          })}
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            ),
        )}
        <div className={styles.endRow}>
          {selectable && <div className={styles.radioCol}></div>}
          {/* <div className={styles.time}></div> */}
          <div className={styles.endIcon}>
            {renderEndIcon(data?.processInstance?.processStatus)}
          </div>
          <div className={styles.user}>
            <div className={styles.nodeName}>
              {renderEndText(data?.processInstance?.processStatus)}
            </div>
          </div>
        </div>
      </Radio.Group>
    </div>
  );
};

export default React.memo(ProcessRender);

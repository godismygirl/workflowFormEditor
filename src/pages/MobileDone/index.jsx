import React, { useState, useEffect } from 'react';
import { request, history } from 'umi';
import { Tag } from 'react-vant';
import Tloader from 'react-touch-loader';
import styles from './styles.less';

const PAGE_SIZE = 10;

const MobileTodo = () => {
  const [listState, setListState] = useState({
    hasMore: true,
    data: [],
    pageIndex: 1,
    initializing: 1,
  });

  const fetchData = async (pageIndex) => {
    const res = await request('./PROD/tasks/dones', {
      params: {
        // orderDescs: [
        //   {
        //     col: 'name',
        //     asc: true,
        //   },
        // ],
        pageNum: pageIndex ?? 1,
        pageSize: PAGE_SIZE,
      },
    });

    return res.data;
  };

  const onRefesh = async (resolve) => {
    const data = await fetchData();

    const hasMore = data?.length == PAGE_SIZE;

    setListState({
      hasMore: hasMore,
      data: data,
      pageIndex: 1,
      initializing: 2,
    });

    resolve?.();
  };

  const onLoadMore = async (resolve) => {
    //debugger;
    setListState({
      ...listState,
      initializing: 1,
    });

    const nextIndex = listState.pageIndex + 1;
    const data = await fetchData(nextIndex);
    const hasMore = data?.length == PAGE_SIZE;

    setListState({
      hasMore: hasMore,
      data: [...listState.data, ...data],
      pageIndex: nextIndex,
      initializing: 2,
    });

    resolve();
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'PROCESSING':
        return <Tag color="#1677ff">处理中</Tag>;
      case 'DELETED':
        return <Tag color="#95a5a6">已撤回</Tag>;
      case 'COMPLETED':
        return <Tag color="#27ae60">已完成</Tag>;
      case 'DENIED':
        return <Tag color="#f50">已拒绝</Tag>;
      default:
    }
  };

  useEffect(() => {
    onRefesh();
  }, []);

  return (
    <div className={styles.container}>
      <Tloader
        className={styles.list}
        onRefresh={onRefesh}
        onLoadMore={onLoadMore}
        hasMore={listState.hasMore}
        initializing={listState.initializing}
      >
        {listState?.data?.map((el) => (
          <div
            key={el.id}
            className={styles.item}
            onClick={() => {
              history.push({
                pathname: '/mobile-done-detail',
                search: `?processId=${el.processInstanceId}&action=no`,
              });
            }}
          >
            <div className={styles.header}>{el.name}</div>
            <div className={styles.row}>
              <div className={styles.label}>发起人</div>
              <div className={styles.content}>{el.initiator.name}</div>
            </div>

            <div className={styles.row}>
              <div className={styles.label}>发起时间</div>
              <div className={styles.content}>{el.startTime}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>关键信息</div>
              <div className={styles.content}>{el.tag}</div>
            </div>
            <div className={styles.tag}>{renderStatus(el.processStatus)}</div>
          </div>
        ))}
      </Tloader>
    </div>
  );
};

export default React.memo(MobileTodo);

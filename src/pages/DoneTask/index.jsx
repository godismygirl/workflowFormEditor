import React, { useState, useMemo } from 'react';
import { useRequest, request, useLocation, useSearchParams } from 'umi';
import { Table, Tag } from 'antd';
import { parse } from 'query-string';
import Page from '@/comps/Page';
import Filter from '@/pages/TodoTask/Filter';
import Detail from './Detail';

const DoneTask = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  const query = parse(search);

  const initAppIds = useMemo(() => {
    if (query.apps) {
      const options = JSON.parse(query.apps);
      if (options[0].value?.startsWith('[')) {
        const ids = JSON.parse(options[0].value);
        return ids;
      }
    }
  }, [query?.apps]);

  const [filterOptions, setFilterOptions] = useState({ appIds: initAppIds });

  const [info, setInfo] = useState({
    processId: '',
    open: false,
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'indexNumber',
      width: 60,
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '关键信息',
      dataIndex: 'tag',
      width: 200,
      ellipsis: true,
    },
    {
      title: '发起人',
      dataIndex: 'initiator',
      width: 120,
      ellipsis: true,
      render: (_, row) => row.initiator?.name,
    },
    {
      title: '发起人组织',
      dataIndex: 'initiator',
      width: 220,
      ellipsis: true,
      render: (_, row) => row.initiator?.orgName,
    },
    {
      title: '当前节点',
      dataIndex: 'name',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
    },
    {
      title: '审批状态',
      dataIndex: 'processStatus',
      width: 90,
      render: (v) => renderStatus(v),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_, row) => (
        <a
          onClick={() => {
            // if (!query.appId) {
            //   searchParams.set('appId', row.appId);
            //   setSearchParams(searchParams);
            // }
            setInfo({
              open: true,
              processId: row.processInstanceId,
            });
          }}
        >
          查看详情
        </a>
      ),
    },
  ];

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

  const service = ({ current, pageSize }) => {
    return request('./PROD/tasks/dones', {
      method: 'post',
      data: {
        // orderDescs: [
        //   {
        //     col: 'name',
        //     asc: true,
        //   },
        // ],
        appId: query?.appId,
        ...filterOptions,
        pageNum: current,
        pageSize,
      },
    });
  };

  const { tableProps, refresh } = useRequest(service, {
    paginated: true,
    defaultPageSize: 10,
    refreshDeps: [filterOptions],
    formatResult: (res) => ({
      list: res.data?.map((el, index) => ({
        ...el,
        indexNumber: `${
          (tableProps.pagination.current - 1) * tableProps.pagination.pageSize +
          (index + 1)
        }`,
      })),
      total: res.total,
    }),
  });

  if (query.portable) {
    return (
      <>
        <Filter hideTimeRange onFilterChange={(v) => setFilterOptions(v)} />
        <Table
          rowKey="id"
          columns={columns}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            //showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
        <Detail
          {...info}
          onCancel={() => setInfo({ open: false, processId: '' })}
        />
      </>
    );
  } else {
    return (
      <Page>
        <Page.Header title="已处理的"></Page.Header>
        <Page.Body style={{ padding: '15px 20px' }}>
          <Table
            rowKey="id"
            columns={columns}
            {...tableProps}
            pagination={{
              ...tableProps.pagination,
              showSizeChanger: true,
              //showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
          <Detail
            {...info}
            onCancel={() => setInfo({ open: false, processId: '' })}
          />
        </Page.Body>
      </Page>
    );
  }
};

export default React.memo(DoneTask);

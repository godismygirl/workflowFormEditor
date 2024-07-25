import React, { useState, useMemo } from 'react';
import { useRequest, request, useLocation, useSearchParams } from 'umi';
import { Table, Tag } from 'antd';
import Page from '@/comps/Page';
import { parse } from 'query-string';
import Filter from './Filter';
import ActionModal from './ActionModal';

const TodoTask = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();
  const query = parse(search);

  const [info, setInfo] = useState({
    processId: '',
    taskId: '',
    open: false,
  });

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
      title: '发起时间',
      dataIndex: 'startTime',
    },
    {
      title: '接收时间',
      dataIndex: 'createTime',
    },
    {
      title: '当前节点',
      dataIndex: 'name',
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      width: 90,
      render: () => <Tag color="#1677ff">待处理</Tag>,
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
              taskId: row.id,
            });
          }}
        >
          立即处理
        </a>
      ),
    },
  ];

  const service = ({ current, pageSize }) => {
    return request('./PROD/tasks/pendings', {
      method: 'post',
      data: {
        // orderDescs: [
        //   {
        //     col: 'name',
        //     asc: true,
        //   },
        // ],
        ...filterOptions,
        appId: query?.appId,
        //appIds: query?.appIds ? JSON.parse(query.appIds) : [],
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
        <Filter onFilterChange={(v) => setFilterOptions(v)} hideTimeRange />
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
        <ActionModal
          {...info}
          onCancel={() => setInfo({ open: false, processId: '', taskId: '' })}
          onSuccess={refresh}
        />
      </>
    );
  } else {
    return (
      <Page>
        <Page.Header title="待我处理"></Page.Header>
        <Page.Body style={{ padding: '15px 20px' }}>
          <Filter />
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
          <ActionModal
            {...info}
            onCancel={() => setInfo({ open: false, processId: '', taskId: '' })}
            onSuccess={refresh}
          />
        </Page.Body>
      </Page>
    );
  }
};

export default React.memo(TodoTask);

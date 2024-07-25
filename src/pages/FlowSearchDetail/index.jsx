import React, { useState } from 'react';
import { useLocation, useRequest, request } from 'umi';
import { parse } from 'query-string';
import { Table, Tag, Space, Button, message } from 'antd';
import download from 'downloadjs';
import Filter from './Filter';
import Detail from '@/pages/DoneTask/Detail';
import dayjs from 'dayjs';
import styles from './styles.less';

const FlowSearchDetail = () => {
  const [filterOptions, setFilterOptions] = useState({});
  const [info, setInfo] = useState({
    processId: '',
    open: false,
  });

  const { search } = useLocation();
  const query = parse(search);

  const { data, loading } = useRequest({
    url: './PROD/apps',
    params: { id: query.appId },
  });

  const { data: columns } = useRequest(
    {
      url: './PROD/apps/search',
      method: 'POST',
      data: {
        appId: query.appId,
      },
      params: { only_table: true },
    },
    {
      formatResult: (res) => {
        if (!res?.tableSchema?.columns) return [];
        const cols = res?.tableSchema?.columns;
        cols.unshift({ title: '序号', dataIndex: 'indexNumber', width: 65 });
        cols.push({
          title: '',
          dataIndex: 'action',
          width: 65,
          render: (_, row) => (
            <a
              onClick={() =>
                setInfo({
                  open: true,
                  processId: row.processInstanceId,
                })
              }
            >
              详情
            </a>
          ),
        });
        return cols;
      },
    },
  );

  const service = ({ current, pageSize }) => {
    return request('./PROD/apps/search', {
      method: 'POST',
      data: {
        orderDescs: [
          {
            col: 'startTime',
            asc: false,
          },
        ],
        appId: query.appId,
        pageNum: current,
        pageSize,
        ...filterOptions,
      },
    });
  };

  const { tableProps, refresh } = useRequest(service, {
    paginated: true,
    defaultPageSize: 10,
    ready: !!filterOptions?.initiatorOrgId,
    refreshDeps: [filterOptions],
    formatResult: (res) => ({
      list: res.data?.map((el, index) => ({
        indexNumber: `${
          (tableProps.pagination.current - 1) * tableProps.pagination.pageSize +
          (index + 1)
        }`,
        ...el,
      })),
      total: res.total,
    }),
  });

  const exportExcel = async () => {
    request('./PROD/apps/search?to_excel=true', {
      method: 'post',
      data: {
        orderDescs: [
          {
            col: 'startTime',
            asc: false,
          },
        ],
        appId: query.appId,
        ...filterOptions,
      },
      responseType: 'blob',
    })
      .then((data) => {
        if (!data) {
          message.error('导出失败');
          return;
        }

        download(
          data,
          `${filterOptions.orgName || '全部'}-统计-${dayjs().format(
            'YYYYMMDDHHmmss',
          )}.xlsx`,
          'application/vnd.ms-excel',
        );
      })
      .catch((error) => {});
  };

  return (
    <div className={styles.container}>
      <Filter
        fields={data?.formModel?.searchConfig?.filterableFields}
        onChange={(v) => setFilterOptions(v)}
        onExportExcel={exportExcel}
      />
      <div className={styles.table}>
        <Table
          rowKey="id"
          columns={columns}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            //showSizeChanger: true,
            //showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>
      <Detail
        {...info}
        onCancel={() => setInfo({ open: false, processId: '' })}
      />
    </div>
  );
};

export default React.memo(FlowSearchDetail);

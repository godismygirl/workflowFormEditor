import React, { useState, useEffect } from 'react';
import { useLocation, useRequest, useModel } from 'umi';
import { parse } from 'query-string';
import Page from '@/comps/Page';
import { Tabs, Space, Button } from 'antd';
import {
  BlockOutlined,
  ContainerOutlined,
  ApartmentOutlined,
  SettingOutlined,
  TableOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import PageHeader from './PageHeader';
import BasicInfo from './BasicInfo';
import AuditForm from './AuditForm';
import Workflow from './Workflow';
import ColumnDesign from './ColumnDesign';
import PrintDesign from './PrintDesign';
import ExtraConfig from './ExtraConfig';
import SaveBtn from './SaveBtn';
import styles from './styles.less';

export const TAB_KEY = {
  BASIC: 'BASIC',
  FORM: 'FORM',
  WORKFLOW: 'WORKFLOW',
  COLUMN: 'COLUMN',
  PRINT: 'PRINT',
  CONFIG: 'CONFIG',
};

const Editor = () => {
  const { update } = useModel('useAppHeader');
  const { updateResult, updateStatus } = useModel('useSaveProgress');
  const { setLayout } = useModel('useFormLayout');
  const { setProcess, restoreProcess, activeProcessNode } =
    useModel('useWorkflow');

  const [activeTab, setActiveTab] = useState(TAB_KEY.BASIC);

  const { search } = useLocation();
  const query = parse(search);

  const { data } = useRequest(
    { url: './PROD/apps', params: { id: query.appId } },
    {
      ready: !!query?.appId,
      onSuccess: (d) => {
        //应用数据请求后，先更新验证结果，不然有的tab没点击过，直接保存提交，不会单独校验
        updateStatus({
          [TAB_KEY.BASIC]: 'finish',
          [TAB_KEY.FORM]: 'finish',
          [TAB_KEY.WORKFLOW]: 'finish',
          [TAB_KEY.COLUMN]: d.formModel?.searchConfig ? 'finish' : 'process',
          [TAB_KEY.PRINT]: d.configs?.printConfig ? 'finish' : 'process',
          [TAB_KEY.CONFIG]: 'finish',
        });

        updateResult({
          [TAB_KEY.BASIC]: { name: d.name, props: d.props, remark: d.remark },
          [TAB_KEY.FORM]: d.formModel.fields,
          [TAB_KEY.WORKFLOW]: d.processModel?.nodeModel,
          [TAB_KEY.COLUMN]: d.formModel?.searchConfig,
          [TAB_KEY.PRINT]: { printConfig: d.configs?.printConfig },
          [TAB_KEY.CONFIG]: {
            ...d.processModel?.flowConfig,
            tagFieldId: d.formModel?.displayConfig?.tagFieldId,
            noticeConfig: d.processModel?.noticeConfig,
          },
        });

        update({ name: d.name, icon: d.props });
        setLayout(d.formModel.fields);

        if (query.hasWorkflow) {
          setProcess(d.processModel.nodeModel);
        }
      },
    },
  );

  useEffect(() => {
    setLayout([]);
    restoreProcess([]);
  }, []);

  return (
    <Page>
      <Page.Body>
        <PageHeader />
        <Tabs
          activeKey={activeTab}
          className={styles.tab}
          centered
          onChange={(t) => {
            setActiveTab(t);
            luckysheet?.exitEditMode();
            activeProcessNode(null);
          }}
          tabBarExtraContent={{
            right: (
              <Space style={{ marginRight: 15 }}>
                <SaveBtn />
              </Space>
            ),
          }}
          items={[
            {
              key: TAB_KEY.BASIC,
              label: (
                <span>
                  <BlockOutlined />
                  基础信息
                </span>
              ),
              children: (
                <BasicInfo
                  data={{
                    name: data?.name,
                    icon: { name: data?.props?.name, hex: data?.props?.hex },
                    remark: data?.remark,
                    tagFieldId: data?.configs?.tagFieldId,
                    approvalObjects: data?.configs?.approvalObjects,
                  }}
                />
              ),
            },
            {
              key: TAB_KEY.FORM,
              label: (
                <span>
                  <ContainerOutlined />
                  表单设计
                </span>
              ),
              children: <AuditForm data={data?.formModel?.fields} />,
            },
            query.hasWorkflow
              ? {
                  key: TAB_KEY.WORKFLOW,
                  label: (
                    <span>
                      <ApartmentOutlined />
                      流程设计
                    </span>
                  ),
                  children: (
                    <Workflow process={data?.processModel?.nodeModel} />
                  ),
                }
              : null,
            {
              key: TAB_KEY.COLUMN,
              label: (
                <span>
                  <TableOutlined />
                  列表设计
                </span>
              ),
              children: <ColumnDesign data={data?.formModel?.searchConfig} />,
            },
            {
              key: TAB_KEY.PRINT,
              label: (
                <span>
                  <PrinterOutlined />
                  打印设置
                </span>
              ),
              children: <PrintDesign data={data?.configs?.printConfig} />,
            },
            {
              key: TAB_KEY.CONFIG,
              label: (
                <span>
                  <SettingOutlined />
                  高级设置
                </span>
              ),
              children: (
                <ExtraConfig
                  data={{
                    ...data?.processModel?.flowConfig,
                    ...data?.processModel?.noticeConfig,
                    displayConfig: data?.formModel?.displayConfig,
                  }}
                />
              ),
            },
          ]}
        />
      </Page.Body>
    </Page>
  );
};

export default React.memo(Editor);

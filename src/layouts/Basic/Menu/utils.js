import * as AntIcons from '@ant-design/icons';
export const getMenuKeys = (menuData, pathname) => {
  const openKeys = [];
  const selectedKeys = [];

  function filteMenuData(data, parentKey) {
    const result = data.find((el) => el.path === pathname);
    if (result) {
      openKeys.push(parentKey);
      selectedKeys.push(result.id);
      return;
    }
    data.map((m) => {
      if (m.children) {
        filteMenuData(m.children, m.id);
      }
    });
  }

  if (Array.isArray(menuData)) {
    filteMenuData(menuData);
  }

  return { openKeys, selectedKeys };
};

export const getRootSubMenuKeys = (menuData, { keyName = 'id' }) => {
  let rootSubMenuKeys = [];
  if (Array.isArray(menuData)) {
    menuData.map((el) => {
      if (Array.isArray(el.children) && el.children.length > 0) {
        rootSubMenuKeys.push(el[keyName]);
      }
    });
  }
  return rootSubMenuKeys;
};

const testMenu = [
  {
    id: '1129078970258034688',
    appId: '1129067292644610048',
    name: '字典管理',
    type: 'PAGE',
    pathCode: '1lpbStWt3Ve|1lpc0rblyjS',
    parentId: '1129078518384693248',
    funcConfig: {
      defaultIcon: {
        name: 'HddOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 1,
    updatedTime: '2023-07-13T15:56:43.782868',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129075964120666112'],
    resources: [
      {
        id: '1129075964120666112',
        packageId: '1129065605854924800',
        name: '系统管理-字典管理',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/system/dictionary',
        },
        updatedTime: '2023-07-13T15:44:47.063556',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129077396160909312',
    appId: '1129067292644610048',
    name: '单位管理',
    type: 'PAGE',
    pathCode: '1lpbmjGKKmA|1lpbyIZ6qLm',
    parentId: '1129076691383619584',
    funcConfig: {
      defaultIcon: {
        name: 'FundOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 1,
    updatedTime: '2023-07-13T15:50:28.488752',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129074401587236864'],
    resources: [
      {
        id: '1129074401587236864',
        packageId: '1129065605854924800',
        name: '组织管理-单位管理',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/orgnization/org',
        },
        updatedTime: '2023-07-13T15:38:55.730627',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129067465462517760',
    appId: '1129067292644610048',
    name: '应用管理',
    type: 'DIRECTORY',
    pathCode: '1lp8JTbo16U',
    parentId: '-1',
    funcConfig: {
      defaultIcon: {
        name: 'LeftCircleOutlined',
        type: 'antd',
      },
    },
    remark: '应用管理',
    active: true,
    quote: false,
    orderIndex: 1,
    updatedTime: '2023-07-13T15:30:32.035939',
    updatedBy: '1118482192035876864',
    resourceIds: null,
    resources: [],
  },
  {
    id: '1129071166533144576',
    appId: '1129067292644610048',
    name: '应用包',
    type: 'PAGE',
    pathCode: '1lp8JTbo16U|1lp9N34dbUc',
    parentId: '1129067465462517760',
    funcConfig: {
      defaultIcon: {
        name: 'ArrowRightOutlined',
        type: 'antd',
      },
    },
    remark: '试试',
    active: true,
    quote: false,
    orderIndex: 1,
    updatedTime: '2023-07-13T15:25:43.230222',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129065905638608896'],
    resources: [
      {
        id: '1129065905638608896',
        packageId: '1129065605854924800',
        name: '应用管理-应用包',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/application/package',
        },
        updatedTime: '2023-07-13T15:04:48.934507',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1119264503552020480',
    appId: '1118912084605919232',
    name: '试一试功能呢',
    type: 'PAGE',
    pathCode: '1kGf5fot9uw',
    parentId: '-1',
    funcConfig: {
      selectedIcon: {
        name: 'UpCircleOutlined',
        type: 'antd',
      },
      defaultIcon: {
        name: 'ArrowLeftOutlined',
        type: 'antd',
      },
    },
    remark: '发士大夫撒嘎嘎公司',
    active: true,
    quote: false,
    orderIndex: 1,
    updatedTime: '2023-06-16T17:33:20.401058',
    updatedBy: '-1',
    resourceIds: ['1116731881179189248'],
    resources: [
      {
        id: '1116731881179189248',
        packageId: '1116721681244229632',
        name: '试试资源1',
        parentId: '1116724439313682432',
        type: 'PAGE',
        resourceConfig: {
          configJson: '的发生发生',
        },
        updatedTime: '2023-07-07T16:07:35.751613',
        remark: '阿斯顿发傻瓜',
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129077137603039232',
    appId: '1129067292644610048',
    name: '部门管理',
    type: 'PAGE',
    pathCode: '1lpbmjGKKmA|1lpbuaKZXqg',
    parentId: '1129076691383619584',
    funcConfig: {
      defaultIcon: {
        name: 'PlusOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 2,
    updatedTime: '2023-07-13T15:49:26.843892',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129074621389737984'],
    resources: [
      {
        id: '1129074621389737984',
        packageId: '1129065605854924800',
        name: '组织管理-部门管理',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/orgnization/depart',
        },
        updatedTime: '2023-07-13T15:39:26.932109',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129076691383619584',
    appId: '1129067292644610048',
    name: '组织管理',
    type: 'DIRECTORY',
    pathCode: '1lpbmjGKKmA',
    parentId: '-1',
    funcConfig: {
      defaultIcon: {
        name: 'AlignLeftOutlined',
        type: 'antd',
      },
    },
    remark: '组织管理',
    active: true,
    quote: false,
    orderIndex: 2,
    updatedTime: '2023-07-13T15:47:55.793056',
    updatedBy: '1118482192035876864',
    resourceIds: null,
    resources: [],
  },
  {
    id: '1129073156361293824',
    appId: '1129067292644610048',
    name: '应用资源',
    type: 'PAGE',
    pathCode: '1lp8JTbo16U|1lpam53nk1q',
    parentId: '1129067465462517760',
    funcConfig: {
      defaultIcon: {
        name: 'ArrowRightOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 2,
    updatedTime: '2023-07-13T15:33:37.641469',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129066757434642432'],
    resources: [
      {
        id: '1129066757434642432',
        packageId: '1129065605854924800',
        name: '应用管理-应用资源',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/application/resource',
        },
        updatedTime: '2023-07-13T15:08:12.019198',
        remark: '',
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1119318812311556096',
    appId: '1118912084605919232',
    name: '按钮组1',
    type: 'BUTTON',
    pathCode: '1kGf5fot9uw|1kGuvnPTyJW',
    parentId: '1119264503552020480',
    funcConfig: null,
    remark: null,
    active: true,
    quote: false,
    orderIndex: 2,
    updatedTime: '2023-06-16T17:33:20.793457',
    updatedBy: '-1',
    resourceIds: ['1116732835337211904'],
    resources: [
      {
        id: '1116732835337211904',
        packageId: '1116721681244229632',
        name: '试资源1-1',
        parentId: '1116731881179189248',
        type: 'BUTTON',
        resourceConfig: {
          configJson: '发到付',
          bindCode: 'buton1',
        },
        updatedTime: '2023-06-09T14:17:35.865524',
        remark: '阿斯顿发傻瓜',
        updatedBy: '-1',
      },
    ],
  },
  {
    id: '1129078518384693248',
    appId: '1129067292644610048',
    name: '系统管理',
    type: 'DIRECTORY',
    pathCode: '1lpbStWt3Ve',
    parentId: '-1',
    funcConfig: {
      defaultIcon: {
        name: 'SettingOutlined',
        type: 'antd',
      },
    },
    remark: '系统管理',
    active: true,
    quote: false,
    orderIndex: 3,
    updatedTime: '2023-07-13T15:54:56.0478',
    updatedBy: '1118482192035876864',
    resourceIds: null,
    resources: [],
  },
  {
    id: '1129077547684335616',
    appId: '1129067292644610048',
    name: '角色管理',
    type: 'DIRECTORY',
    pathCode: '1lpbmjGKKmA|1lpbBonzhM4',
    parentId: '1129076691383619584',
    funcConfig: {
      defaultIcon: {
        name: 'AreaChartOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 3,
    updatedTime: '2023-07-13T15:51:04.615244',
    updatedBy: '1118482192035876864',
    resourceIds: null,
    resources: [],
  },
  {
    id: '1129071428433874944',
    appId: '1129067292644610048',
    name: '应用产品',
    type: 'PAGE',
    pathCode: '1lp8JTbo16U|1lp9REWxXUI',
    parentId: '1129067465462517760',
    funcConfig: {
      defaultIcon: {
        name: 'ArrowUpOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 3,
    updatedTime: '2023-07-13T15:26:45.671645',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129066975160963072'],
    resources: [
      {
        id: '1129066975160963072',
        packageId: '1129065605854924800',
        name: '应用管理-应用产品',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/application/product',
        },
        updatedTime: '2023-07-13T15:09:03.929353',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1119318811959234560',
    appId: '1118912084605919232',
    name: '按钮组2',
    type: 'BUTTON',
    pathCode: '1kGf5fot9uw|1kGuvns3fOw',
    parentId: '1119264503552020480',
    funcConfig: null,
    remark: null,
    active: true,
    quote: false,
    orderIndex: 3,
    updatedTime: '2023-06-16T17:33:20.712851',
    updatedBy: '-1',
    resourceIds: ['1116732835337211904'],
    resources: [
      {
        id: '1116732835337211904',
        packageId: '1116721681244229632',
        name: '试资源1-1',
        parentId: '1116731881179189248',
        type: 'BUTTON',
        resourceConfig: {
          configJson: '发到付',
          bindCode: 'buton1',
        },
        updatedTime: '2023-06-09T14:17:35.865524',
        remark: '阿斯顿发傻瓜',
        updatedBy: '-1',
      },
    ],
  },
  {
    id: '1129077758854959104',
    appId: '1129067292644610048',
    name: '产品订购管理',
    type: 'PAGE',
    pathCode: '1lpbmjGKKmA|1lpbF6SHHyg',
    parentId: '1129076691383619584',
    funcConfig: {
      defaultIcon: {
        name: 'BarChartOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 4,
    updatedTime: '2023-07-13T15:51:54.962246',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129074910788325376'],
    resources: [
      {
        id: '1129074910788325376',
        packageId: '1129065605854924800',
        name: '组织管理-产品订购管理',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/orgnization/order',
        },
        updatedTime: '2023-07-13T15:40:35.929912',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129073340763869184',
    appId: '1129067292644610048',
    name: '应用功能',
    type: 'PAGE',
    pathCode: '1lp8JTbo16U|1lpapkkXJFS',
    parentId: '1129067465462517760',
    funcConfig: {
      defaultIcon: {
        name: 'PlusSquareOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 4,
    updatedTime: '2023-07-13T15:34:21.606558',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129067093440335872'],
    resources: [
      {
        id: '1129067093440335872',
        packageId: '1129065605854924800',
        name: '应用管理-应用功能',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/application/function',
        },
        updatedTime: '2023-07-13T15:09:32.12853',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129077990888050688',
    appId: '1129067292644610048',
    name: '用户管理',
    type: 'PAGE',
    pathCode: '1lpbmjGKKmA|1lpbJc9IUjm',
    parentId: '1129076691383619584',
    funcConfig: {
      defaultIcon: {
        name: 'ClearOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 5,
    updatedTime: '2023-07-13T15:52:50.282353',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129075004229029888'],
    resources: [
      {
        id: '1129075004229029888',
        packageId: '1129065605854924800',
        name: '组织管理-用户管理',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/orgnization/user',
        },
        updatedTime: '2023-07-13T15:40:58.208104',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1129078203182747648',
    appId: '1129067292644610048',
    name: '员工管理',
    type: 'PAGE',
    pathCode: '1lpbmjGKKmA|1lpbMVSVOWQ',
    parentId: '1129076691383619584',
    funcConfig: {
      defaultIcon: {
        name: 'BookOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 6,
    updatedTime: '2023-07-13T15:53:40.898223',
    updatedBy: '1118482192035876864',
    resourceIds: ['1129075296827871232'],
    resources: [
      {
        id: '1129075296827871232',
        packageId: '1129065605854924800',
        name: '组织管理-员工管理',
        parentId: '-1',
        type: 'PAGE',
        resourceConfig: {
          configJson: '/orgnization/employee',
        },
        updatedTime: '2023-07-13T15:42:07.968912',
        remark: null,
        updatedBy: '1118482192035876864',
      },
    ],
  },
  {
    id: '1128329973533356032',
    appId: '1118912084605919232',
    name: 'WEB端-智安医院通-应用功能名称的测试',
    type: 'DIRECTORY',
    pathCode: '1llLjVJ32la',
    parentId: '-1',
    funcConfig: {
      defaultIcon: {
        name: 'CheckCircleOutlined',
        type: 'antd',
      },
    },
    remark: null,
    active: true,
    quote: false,
    orderIndex: 30000,
    updatedTime: '2023-07-12T15:16:00.975317',
    updatedBy: '1118482192035876864',
    resourceIds: null,
    resources: [],
  },
];

const getIcon = (iconConfig) => {
  if (!iconConfig) return;
  if (iconConfig.type === 'antd') {
    const Icon = AntIcons[iconConfig.name];
    return <Icon />;
  }
};

export const formatMenu = (menuData) => {
  if (!menuData?.length > 0) return [];
  // const formatArr = (arr) => {
  //   return arr?.map((el) => ({
  //     ...el,
  //     key: el.id,
  //     label: el.text,
  //     children: formatArr(el.children),
  //   }));
  // };
  // return formatArr(menuData);

  //DIRECTORY 是根目录
  const result = [];

  menuData.map((el) => {
    if (el.type === 'DIRECTORY') {
      result.push({ key: el.id, label: el.name, children: [] });
    }
  });

  //DIRECTORY 页面作为子节点
  menuData.map((el) => {
    if (el.type === 'PAGE') {
      const target = result.find((p) => p.id === el.parentId);
      target.children.push({
        key: el.id,
        label: el.name,
        icon: getIcon(el.funcConfig?.defaultIcon),
        resources: el.resources,
      });
    }
  });
};

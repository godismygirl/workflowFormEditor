import { uid } from 'uid';
import {
  NumberOutlined,
  CalendarOutlined,
  FormOutlined,
  FontSizeOutlined,
  ControlOutlined,
  GroupOutlined,
  DownSquareOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  FolderOpenOutlined,
  FontColorsOutlined,
  AlignLeftOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  DashOutlined,
  TeamOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

export const CATEGORY = {
  UI: 'UI',
  INTERACT: 'INTERACT',
  LAYOUT: 'LAYOUT',
  BUSINESS: 'BUSINESS',
};

export const COMP_NAMES = {
  DATE_PICKER: 'DATE_PICKER',
  TIME_PICKER: 'TIME_PICKER',
  INPUT: 'INPUT',
  INPUT_NUMBER: 'INPUT_NUMBER',
  TEXT_AREA: 'TEXT_AREA',
  SELECT: 'SELECT',
  SLIDER: 'SLIDER',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  GROUP: 'GROUP',
  SECTION: 'SECTION',
  IMAGE_PICKER: 'IMAGE_PICKER',

  TITLE: 'TITLE',
  TEXT: 'TEXT',
  DIVIDER: 'DIVIDER',
  UPLOAD: 'UPLOAD',

  EMPLOYEE_PICKER: 'EMPLOYEE_PICKER', //人员选择
  DEPART_PICKER: 'DEPART_PICKER', //部门选择
  ORG_PICKER: 'ORG_PICKER', //单位选择
  POST_PICKER: 'POST_PICKER', //岗位选择
  WORK_PERMIT_INPUT: 'WORK_PERMIT_INPUT', //上岗证号
  SERVICE_PROVIDER: 'SERVICE_PROVIDER', //上岗证号
  CLOSABLE_IMAGE_PICKER: 'CLOSABLE_IMAGE_PICKER', //带禁用的上传图片
};

export const COMP_NAMES_MAP = {
  [COMP_NAMES.DATE_PICKER]: 'DatePicker',
  [COMP_NAMES.TIME_PICKER]: 'TimePicker',
  [COMP_NAMES.INPUT]: 'Input',
  [COMP_NAMES.INPUT_NUMBER]: 'InputNumber',
  [COMP_NAMES.TEXT_AREA]: 'TextArea',
  [COMP_NAMES.SELECT]: 'Select',
  [COMP_NAMES.SLIDER]: 'Slider',
  [COMP_NAMES.RADIO]: 'Radio',
  [COMP_NAMES.CHECKBOX]: 'Checkbox',
  [COMP_NAMES.GROUP]: 'Group',
  [COMP_NAMES.SECTION]: 'Section',
  [COMP_NAMES.IMAGE_PICKER]: 'ImagePicker',
  [COMP_NAMES.UPLOAD]: 'Upload',
  //ui
  [COMP_NAMES.TITLE]: 'Title',
  [COMP_NAMES.TEXT]: 'Text',
  [COMP_NAMES.DIVIDER]: 'Divider',
  //business
  [COMP_NAMES.EMPLOYEE_PICKER]: 'EmployeePicker',
  [COMP_NAMES.DEPART_PICKER]: 'DepartPicker',
  [COMP_NAMES.ORG_PICKER]: 'OrgPicker',
  [COMP_NAMES.POST_PICKER]: 'PostPicker',
  [COMP_NAMES.WORK_PERMIT_INPUT]: 'WorkPermitInput',
  [COMP_NAMES.SERVICE_PROVIDER]: 'ServiceProvider',
  [COMP_NAMES.CLOSABLE_IMAGE_PICKER]: 'ClosableImagePicker',
};

export const UI_COMP_NAMES = {
  name: 'Text',
  SUMMARY: 'Summary',
};

export const INTERATC_COMPS_LIST = [
  {
    name: '单行文本',
    icon: <FormOutlined />,
    type: COMP_NAMES.INPUT,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '单行文本',
      placeholder: '请输入',
      fontSize: 14,
      required: false,
    },
  },
  {
    name: '多行文本',
    icon: <FontSizeOutlined />,
    type: COMP_NAMES.TEXT_AREA,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '多行文本',
      placeholder: '请输入',
      fontSize: 14,
      required: false,
    },
  },
  {
    name: '数字输入框',
    icon: <NumberOutlined />,
    type: COMP_NAMES.INPUT_NUMBER,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '数字输入框',
      placeholder: '请输入',
      fontSize: 14,
      required: false,
    },
  },
  {
    name: '日期选择器',
    icon: <CalendarOutlined />,
    type: COMP_NAMES.DATE_PICKER,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '日期选择器',
      placeholder: '请选择',
      placeholder: '',
      showTimeFormat: 'YYYY-MM-DD',
      required: false,
    },
  },
  {
    name: '时间选择器',
    icon: <ClockCircleOutlined />,
    type: COMP_NAMES.TIME_PICKER,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '时间选择器',
      placeholder: '请选择',
      required: false,
    },
  },
  // {
  //   name: '下拉选择器',
  //   icon: <DownSquareOutlined />,
  //   type: COMP_NAMES.SELECT,
  //   category: CATEGORY.INTERACT,
  //   attrs: {
  //     label: '下拉选择器',
  //     placeholder: '请选择',
  //     status: 'normal',
  //     options: [],
  //   },
  // },

  {
    name: '移动滑块',
    icon: <ControlOutlined />,
    type: COMP_NAMES.SLIDER,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '移动滑块',
      min: 0,
      max: 100,
      step: 1,
      value: 20,
      //percent: true,
      required: false,
    },
  },
  {
    name: '单选框',
    icon: <CheckCircleOutlined />,
    type: COMP_NAMES.RADIO,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '单选框',
      options: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
      ],
      value: 1,
      direction: 'vertical',
      required: false,
    },
  },
  {
    name: '多选框',
    icon: <CheckSquareOutlined />,
    type: COMP_NAMES.CHECKBOX,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '多选框',
      options: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
      ],
      value: [1, 2],
      direction: 'vertical',
      shape: 'square',
      required: false,
    },
  },
  {
    name: '图片上传',
    icon: <PictureOutlined />,
    type: COMP_NAMES.IMAGE_PICKER,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '图片上传',
      maxCount: 3,
      limitSize: 1000000,
      required: false,
    },
  },
  {
    name: '文件上传',
    icon: <FolderOpenOutlined />,
    type: COMP_NAMES.UPLOAD,
    category: CATEGORY.INTERACT,
    attrs: {
      label: '文件上传',
      maxCount: 3,
      limitSize: 10 * 1000000,
      required: false,
    },
  },
];

export const UI_COMPS_LIST = [
  {
    name: '页面标题',
    icon: <FontColorsOutlined />,
    type: COMP_NAMES.TITLE,
    category: CATEGORY.UI,
    attrs: {
      fontSize: 18,
      fontWeight: 'bold',
      value: '我是标题',
    },
  },
  {
    name: '文字段落',
    type: COMP_NAMES.TEXT,
    icon: <AlignLeftOutlined />,
    category: CATEGORY.UI,
    attrs: {
      fontSize: 14,
      value: '我是文字段落',
    },
  },
  {
    name: '分割线',
    type: COMP_NAMES.DIVIDER,
    icon: <DashOutlined />,
    category: CATEGORY.UI,
    attrs: {
      value: '我是分割线',
      contentPosition: 'center',
      fontSize: 12,
    },
  },
];

export const LAYOUT_COMPS_LIST = [
  {
    name: '子表单',
    icon: <GroupOutlined />,
    type: COMP_NAMES.GROUP,
    category: CATEGORY.LAYOUT,
    attrs: { label: '子表单', showLabel: true, required: false },
  },
  {
    name: '分组',
    icon: <FolderOpenOutlined />,
    type: COMP_NAMES.SECTION,
    category: CATEGORY.LAYOUT,
    attrs: { label: '分组', showLabel: true, required: false },
  },
];

export const BUSINESS_COMPS_LIST = [
  {
    name: '人员选择',
    icon: <TeamOutlined />,
    type: COMP_NAMES.EMPLOYEE_PICKER,
    category: CATEGORY.BUSINESS,
    attrs: { label: '人员选择', placeholder: '请选择人员', required: false },
  },
  {
    name: '部门选择',
    icon: <InboxOutlined />,
    type: COMP_NAMES.DEPART_PICKER,
    category: CATEGORY.BUSINESS,
    attrs: {
      label: '部门选择',
      placeholder: '请选择部门',
      multiple: false,
      required: false,
    },
  },
  {
    name: '单位选择',
    icon: <InboxOutlined />,
    type: COMP_NAMES.ORG_PICKER,
    category: CATEGORY.BUSINESS,
    attrs: {
      label: '单位选择',
      placeholder: '请选择单位',
      multiple: false,
      required: false,
    },
  },
  {
    name: '岗位选择',
    icon: <InboxOutlined />,
    type: COMP_NAMES.POST_PICKER,
    category: CATEGORY.BUSINESS,
    attrs: {
      label: '岗位选择',
      placeholder: '请选择岗位',
      multiple: false,
      required: false,
    },
  },
  {
    name: '上岗证号',
    icon: <InboxOutlined />,
    type: COMP_NAMES.WORK_PERMIT_INPUT,
    category: CATEGORY.BUSINESS,
    attrs: {
      label: '上岗证号输入',
      placeholder: '请输入上岗证号',
      fontSize: 14,
      required: false,
    },
  },
  {
    name: '相关服务方',
    icon: <InboxOutlined />,
    type: COMP_NAMES.SERVICE_PROVIDER,
    category: CATEGORY.BUSINESS,
    attrs: {
      label: '相关服务方',
      placeholder: '请选择',
      required: false,
    },
  },
  {
    name: '图片上传',
    icon: <InboxOutlined />,
    type: COMP_NAMES.CLOSABLE_IMAGE_PICKER,
    category: CATEGORY.BUSINESS,
    attrs: {
      label: '图片上传',
      maxCount: 3,
      limitSize: 1000000,
      required: false,
    },
  },
];

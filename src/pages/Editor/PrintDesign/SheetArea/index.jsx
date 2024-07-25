import React, { useEffect } from 'react';
import styles from './styles.less';
import { hooks } from 'react-vant';

const SheetArea = ({ initConfig }) => {
  useEffect(() => {
    const options = initConfig ?? {
      container: 'grid-box', //luckysheet为容器id
      title: '',
      lang: 'zh',
      column: 18,
      row: 40,
      allowCopy: false,
      showsheetbar: false,
      showinfobar: false,
      showstatisticBar: false,
      showstatisticBarConfig: {
        count: false, // 计数栏
        view: false, // 打印视图
        zoom: false, // 缩放
      },
      sheetFormulaBar: false,
      enableAddBackTop: false,
      enableAddRow: false,
      sheetFormulaBar: false,
      showtoolbarConfig: {
        undoRedo: true, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
        paintFormat: true, //格式刷
        currencyFormat: false, //货币格式
        percentageFormat: false, //百分比格式
        numberDecrease: false, // '减少小数位数'
        numberIncrease: false, // '增加小数位数
        moreFormats: false, // '更多格式'
        font: true, // '字体'
        fontSize: true, // '字号大小'
        bold: true, // '粗体 (Ctrl+B)'
        italic: true, // '斜体 (Ctrl+I)'
        strikethrough: true, // '删除线 (Alt+Shift+5)'
        underline: true, // '下划线 (Alt+Shift+6)'
        textColor: true, // '文本颜色'
        fillColor: true, // '单元格颜色'
        border: true, // '边框'
        mergeCell: true, // '合并单元格'
        horizontalAlignMode: true, // '水平对齐方式'
        verticalAlignMode: true, // '垂直对齐方式'
        textWrapMode: false, // '换行方式'
        textRotateMode: false, // '文本旋转方式'
        image: false, // '插入图片'
        link: false, // '插入链接'
        chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
        postil: false, //'批注'
        pivotTable: false, //'数据透视表'
        function: false, // '公式'
        frozenMode: false, // '冻结方式'
        sortAndFilter: false, // '排序和筛选'
        conditionalFormat: false, // '条件格式'
        dataVerification: false, // '数据验证'
        splitColumn: false, // '分列'
        screenshot: false, // '截图'
        findAndReplace: false, // '查找替换'
        protection: false, // '工作表保护'
        print: false, // '打印'
      },
      cellRightClickConfig: {
        copy: false, // 复制
        copyAs: false, // 复制为
        paste: false, // 粘贴
        insertRow: true, // 插入行
        insertColumn: true, // 插入列
        deleteRow: true, // 删除选中行
        deleteColumn: true, // 删除选中列
        deleteCell: false, // 删除单元格
        hideRow: false, // 隐藏选中行和显示选中行
        hideColumn: false, // 隐藏选中列和显示选中列
        rowHeight: false, // 行高
        columnWidth: false, // 列宽
        clear: true, // 清除内容
        matrix: false, // 矩阵操作选区
        sort: false, // 排序选区
        filter: false, // 筛选选区
        chart: false, // 图表生成
        image: false, // 插入图片
        link: false, // 插入链接
        data: false, // 数据验证
        cellFormat: false, // 设置单元格格式
      },
      hooks: {},
    };
    luckysheet.create(options);
  }, []);

  return <div className={styles.container} id="grid-box"></div>;
};

export default React.memo(SheetArea);

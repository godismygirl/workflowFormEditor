import React, { Fragment, useEffect, useMemo } from 'react';
import { Button } from 'antd';
import styles from './styles.less';

const PreviewRender = ({ data, valueRender, subformRender }) => {
  //previewMode 用于处理子表单的@id标记,让预览好看一点
  const isInRange = (borderRange, tdData, rowIndex, colIndex) => {
    let inRange = false;

    const row = tdData?.mc?.r ?? rowIndex;
    const col = tdData?.mc?.c ?? colIndex;

    for (let i = 0, l = borderRange.length; i < l; i++) {
      const rowMin = borderRange[i].row[0];
      const rowMax = borderRange[i].row[1];
      const colMin = borderRange[i].column[0];
      const colMax = borderRange[i].column[1];
      if (row >= rowMin && row <= rowMax && col >= colMin && col <= colMax) {
        inRange = true;
        break;
      }
    }

    return inRange;
  };

  const renderBorderStyle = (tdData, rowIndex, colIndex) => {
    let borderStyle = { border: '' };
    {
      data?.config?.borderInfo?.map((bData, index) => {
        if (bData.borderType === 'border-all') {
          if (isInRange(bData.range, tdData, rowIndex, colIndex)) {
            borderStyle = { border: `1px solid ${bData.color}` };
          }
        }

        if (bData.borderType === 'border-none') {
          if (isInRange(bData.range, tdData, rowIndex, colIndex)) {
            borderStyle = { border: `1px solid transparent` };
          }
        }
      });
    }
    return borderStyle;
  };

  const getAlignType = (t) => {
    switch (t) {
      case '0':
        return 'center';
      case '1':
        return 'left';
      case '2':
        return 'right';
      default:
    }
  };

  const renderTdStyle = (tdData, rowIndex, colIndex) => {
    const borderStyle = renderBorderStyle(tdData, rowIndex, colIndex);
    const fontStyle = {
      fontSize: tdData?.fs + 'px',
      color: tdData?.fc,
      textAlign: getAlignType(tdData?.ht),
      fontWeight: tdData?.bl === 1 ? 'bold' : '',
    };
    return { ...borderStyle, ...fontStyle };
  };

  const renderColGroup = () => {
    let result = [];

    const max = data?.column;
    for (let i = 0; i < max; i++) {
      const customWidth = data?.config?.columnlen?.[i];
      result.push(<col key={i} width={customWidth ?? 74} />);
    }
    return result;
  };

  return (
    <>
      <table
        className={styles.table}
        style={{
          width: data.ch_width,
        }}
      >
        <colgroup>{renderColGroup()}</colgroup>
        <tbody>
          {data?.data?.map((trEl, k) => (
            <tr key={k}>
              {trEl?.map((tdEl, i) => {
                //被占位的td:{mc:{r:2, c:3}}
                let tdValue = tdEl?.v;
                if (tdEl?.mc && !tdEl?.mc?.rs)
                  return <Fragment key={i}></Fragment>;
                if (!tdEl)
                  //null 空td
                  return <td key={i} style={renderTdStyle(tdEl, k, i)}></td>;

                if (tdValue?.startsWith('@')) {
                  //子表单标记，单独处理
                  const [_, str] = tdValue?.split('@');
                  const [len, groupId, labels, cmpIds, label] = str?.split('=');

                  if (subformRender) {
                    return (
                      <td
                        key={i}
                        colSpan={len}
                        //rowSpan={tdEl?.mc?.rs}
                        style={{ padding: 0 }}
                      >
                        {subformRender?.({
                          groupId,
                          labels: labels.split('/'),
                          comps: cmpIds.split('/'),
                        })}
                      </td>
                    );
                  } else {
                    //没有提供subformRender方法，则纯展示，把@form-id等字符去除，预览好看一点
                    tdValue = label;
                  }
                }

                if (tdValue?.startsWith('/')) {
                  if (subformRender) {
                    return <Fragment key={i}></Fragment>;
                  } else {
                    const text = tdValue?.split('/');
                    tdValue = text[text.length - 1];
                  }
                }

                return (
                  <td
                    key={i}
                    colSpan={tdEl?.mc?.cs}
                    rowSpan={tdEl?.mc?.rs}
                    style={renderTdStyle(tdEl, k, i)}
                  >
                    {valueRender ? valueRender(tdValue) : tdValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PreviewRender;

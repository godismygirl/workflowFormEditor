import React, { useState, useEffect } from 'react';
import { Button } from 'react-vant';
import RowModal from './RowModal';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

const FormList = ({ value, onChange, readOnly, innerlist }) => {
  const [info, setInfo] = useState({
    open: false,
    index: 0,
    data: null,
  });

  const renderValue = (v) => {
    //值一共4种类型，text, array[text], array[{id, name}] 图片/文件 [{id,name,url}]
    if (Array.isArray(v)) {
      let result = [];
      v?.map((el, i) => {
        if (el.url) {
          result.push(
            <a className={styles.sep} href={el.url}>
              {el.id}
            </a>,
          );
        } else {
          result.push(<span className={styles.sep}>{el.name ?? el}</span>);
        }

        if (i !== v.length - 1) {
          result.push(', ');
        }
      });

      return result;
    } else {
      return v;
    }
  };

  const renderRow = (data, rowIndex) => {
    const colKeys = innerlist?.map((el) => el.id);
    let result = [];
    colKeys?.map((key) => {
      result.push(
        <td
          key={key}
          onClick={(e) => {
            e.stopPropagation();
            if (readOnly) return;

            setInfo({
              index: rowIndex,
              open: true,
              data: value?.[rowIndex],
            });
          }}
        >
          {renderValue(data[key])}
        </td>,
      );
    });

    return result;
  };

  const removeRow = (index) => {
    const copy = value ? [...value] : [];
    copy.splice(index, 1);
    onChange(copy);
  };

  const onSaveRow = ({ index, rowData }) => {
    const copy = value ? [...value] : [];
    copy[index] = rowData;
    onChange?.(copy);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <table
          className={styles.table}
          cellPadding={0}
          cellSpacing={0}
          style={{
            width: innerlist.length * 150,
            borderRight: readOnly ? '1px solid #ddd' : 0,
          }}
        >
          <colgroup>
            {innerlist?.map((el, i) => (
              <col key={i} width={150} />
            ))}
            {!readOnly && <col width={65} />}
          </colgroup>
          <thead>
            <tr>
              {innerlist?.map((el, i) => (
                <th align="left" key={el.id}>
                  {el.attrs?.required && <em className={styles.required}>*</em>}
                  {el.attrs?.label}
                </th>
              ))}
              {!readOnly && (
                <th
                  align="center"
                  className={styles.sticky}
                  style={{ background: '#f8f8f8' }}
                >
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {value?.map((el, i) => (
              <tr key={i}>
                {renderRow(el, i)}
                {!readOnly && (
                  <td
                    align="center"
                    className={styles.sticky}
                    style={{ background: '#fff' }}
                  >
                    <a
                      style={{ color: '#3f45ff' }}
                      onClick={() => removeRow(i)}
                    >
                      删除
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <Button
          type="primary"
          plain
          block
          onClick={() =>
            setInfo({
              index: value?.length ?? 0,
              data: null,
              open: true,
            })
          }
          size="small"
          round
          icon={<PlusOutlined />}
        >
          添加选项
        </Button>
      )}

      <RowModal
        {...info}
        list={innerlist}
        onCancel={() =>
          setInfo({
            open: false,
            index: 0,
            data: null,
          })
        }
        onSave={onSaveRow}
      />
    </div>
  );
};

export default FormList;

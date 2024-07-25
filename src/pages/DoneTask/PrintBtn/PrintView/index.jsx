import React from 'react';
import { useLocation, useRequest } from 'umi';
import { parse } from 'query-string';
import { Button } from 'antd';
import { PreviewRender } from '@/pages/Editor/PrintDesign';
import { convertAllImagesToBase64 } from './convertBase64';
import html2canvas from 'html2canvas';
import printJS from 'print-js';
import styles from './styles.less';

import { testData } from './testData';

const printNow = () => {
  html2canvas(document.getElementById('table-print-area'), {
    useCORS: true, //是否尝试使用CORS从服务器加载图像
    //allowTaint: true, // 是否允许跨来源图像污染画布
    //oreignObjectRendering: true,
    //foreignObjectRendering: true,
    onclone: (cloned) => convertAllImagesToBase64(cloned),
  }).then(function (canvas) {
    const imgData = canvas.toDataURL('image/jpeg', 1);
    const img = new Image();
    img.src = imgData;
    //img.crossOrigin = 'anonymous';
    //const style = '@page {margin:0 10mm};';
    img.onload = function () {
      printJS({
        printable: this.src,
        type: 'image',
        //style,
        //imageStyle: 'width:100%;padding:20px',
      });
    };
  });
};

const PrintView = ({ processId }) => {
  const { search } = useLocation();
  const query = parse(search);

  const targetProccessId = processId || query.processId;

  const { data } = useRequest(
    {
      url: './PROD/processes/details',
      params: { id: targetProccessId },
    },
    {
      ready: !!targetProccessId,
    },
  );

  const printData = data?.configs?.printConfig?.data?.[0];

  const formData = data?.formData;
  const taskData = data?.processInstance?.tasks;

  const getFormValue = (cmpId, parentObj) => {
    const value = parentObj?.[cmpId];
    if (value) {
      //4种类型 text , list, imageList,
      if (Array.isArray(value)) {
        if (cmpId.startsWith('IMAGE_PICKER')) {
          return (
            <>
              {value.map((el, i) => (
                <img
                  key={i}
                  style={{
                    maxWidth: 150,
                    maxHeight: 150,
                    objectFit: 'contain',
                    margin: 2,
                  }}
                  crossOrigin="anonymous"
                  src={`./FILE/files/preview?id=${el.id}`}
                />
              ))}
            </>
          );
        }

        if (cmpId.startsWith('UPLOAD')) {
          return (
            <>
              {value.map((el, i) => (
                <a key={i}>{el.name}</a>
              ))}
            </>
          );
        }

        return <>{value.map((el) => el.name ?? el).join('，')}</>;
      } else {
        return value;
      }
    }
  };

  const getSignatureValue = (v) => {
    const target = taskData?.reverse()?.find((el) => el.nodeId === v);

    if (!target) return;
    return (
      <>
        {target.details[0].comments.map((el, i) => (
          <div className={styles.signBox} key={i}>
            <img
              style={{
                maxWidth: 150,
                maxHeight: 150,
                objectFit: 'contain',
                margin: 2,
              }}
              crossOrigin="anonymous"
              src={el.content}
            />
            <div className={styles.signTime}>
              {target.details?.[0]?.endTime}
            </div>
          </div>
        ))}
      </>
    );
  };

  const valueRender = (value) => {
    if (!value) return;

    let result = value;
    if (value.startsWith('$')) {
      const rest = value.slice(1);
      result = getFormValue(rest, formData);
    }

    if (value.startsWith('#')) {
      const rest = value.slice(1);
      result = getSignatureValue(rest);
    }

    if (value.startsWith('*')) {
      //说明需要渲染审批意见

      const renderSubformItems = (list) => {
        if (!list) return;
        const validComps = list.filter(
          (el) => el.fieldType === 'INPUT' || el.fieldType === 'TEXT_AREA',
        );
        //只渲染第一个textarea或者input
        return validComps?.[0]?.value;
      };

      const auditList = taskData
        ?.filter((el) => el.nodeType == 'TASK')
        ?.slice(1);

      return (
        <>
          {auditList?.map((el, i) => (
            <>
              {el.details.map((de) => {
                const target = de.subForms?.[de.subForms.length - 1];

                return (
                  <>
                    {
                      <div className={styles.auditSection}>
                        <div className={styles.auditNode}>{el.name}</div>
                        <div className={styles.auditContent}>
                          <div className={styles.auditRow}>
                            <div className={styles.auditLabel}>审批人：</div>
                            <div
                              className={styles.auditValue}
                              style={{ marginRight: 18 }}
                            >
                              {de.assignee?.name}
                            </div>
                            <div className={styles.auditLabel}>审批时间：</div>
                            <div className={styles.auditValue}>
                              {de.endTime}
                            </div>
                          </div>
                          {target?.subFormItems && (
                            <div className={styles.auditRow}>
                              <div className={styles.auditLabel}>
                                审批内容：
                              </div>
                              <div className={styles.auditValue}>
                                {renderSubformItems(target.subFormItems)}
                              </div>
                            </div>
                          )}
                          <div className={styles.auditSign}>
                            {de.comments?.[0]?.commentType === 'SIGNATURE' && (
                              <img
                                src={de.comments[0]?.content}
                                style={{ height: 50 }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    }
                  </>
                );
              })}
            </>
          ))}
        </>
      );
    }

    return result;
  };

  const renderSubform = ({ groupId, labels, comps }) => {
    return (
      <table className={styles.subTable}>
        <thead>
          <tr>
            {labels?.map((t, i) => (
              <th key={i}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formData[groupId]?.map((el, i) => (
            <tr key={i}>
              {comps?.map((cid) => (
                <td key={cid}>{getFormValue(cid, el)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.inner} id="table-print-area">
          <div className={styles.scrollCanvas}>
            {printData && (
              <PreviewRender
                data={printData}
                valueRender={valueRender}
                subformRender={renderSubform}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Button type="primary" onClick={() => printNow()}>
          打印表格
        </Button>
      </div>
    </>
  );
};

export default PrintView;

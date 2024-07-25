import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Upload, Button, message, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import getFileMD5 from '@/utils/getFileMD5';
import axios from 'axios';
import styles from './styles.less';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const uploadServise = async ({
  action,
  file,
  onSuccess,
  onProgress,
  onError,
}) => {
  let md5 = await getFileMD5(file);

  const { data } = await request('./FILE/files/upload-urls', {
    method: 'POST',
    data: {
      fileName: file.name,
      md5,
      size: file.size,
    },
  });

  let finalFileId = data.fileId;

  if (!finalFileId) {
    const uploadUrl = data.chunkUploadUrls?.[0]?.putUrl;
    if (!uploadUrl) {
      message.error('上传服务地址出错');
      onError();
      return;
    }

    await axios.put(uploadUrl, file);

    const res = await request('./FILE/files/upload-urls', {
      method: 'POST',
      data: {
        fileName: file.name,
        md5,
        size: file.size,
      },
    });

    finalFileId = res.data.fileId;
  }

  onProgress({ percent: 100 }, file);
  onSuccess({ fileId: finalFileId }, file);
};

export default (props) => {
  const {
    onChange,
    value,
    maxCount,
    accept,
    disabled,
    limitSize,
    uploadText,
    placeholder,
    templateSrc,
    templateName,
    readOnly,
    ...rest
  } = props;

  const [allowUpload, setAllowUpload] = useState(false);

  const [files, setFiles] = useState([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url:
    //     'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
  ]);

  const onRemoveFile = (file) => {
    if (readOnly) return;
    const fileList = files.filter((el) => el.uid !== file.uid);
    setFiles(fileList);
    if (onChange) {
      onChange(fileList);
    }
  };

  const handleChange = ({ file, fileList }) => {
    if (readOnly) return;

    setFiles(fileList);

    if (limitSize) {
      if (file.size > limitSize) {
        message.error('文件大小过大');
        return;
      }
    }

    // 被beforeUpload拦截掉的图片不会有status状态
    const allDone = !fileList.find((f) => f.status !== 'done' && !f.id);

    if (allDone) {
      const result = fileList.map((el) => ({
        name: el.name,
        id: el.id ?? el.response?.fileId,
      }));
      onChange?.(result);
    }
  };

  useEffect(() => {
    if (value) {
      const result = value?.map((el) => ({
        ...el,
        url: `./FILE/files/preview?id=${el.id}`,
      }));
      setFiles(result);
      setAllowUpload(value?.length > 0);
    }
  }, [value]);

  return (
    <>
      <div className={styles.row}>
        <div className={styles.box}>
          <div className={styles.switch}>
            <Switch
              checked={allowUpload}
              disabled={disabled}
              checkedChildren="允许上传"
              unCheckedChildren="禁止上传"
              onChange={(checked) => {
                if (readOnly) return;
                setAllowUpload(checked);
                if (!checked) {
                  setFiles([]);
                  onChange?.([]);
                }
              }}
            />
          </div>
          {allowUpload && (
            <div className={styles.uploadBox}>
              <Upload
                disabled={disabled}
                fileList={files}
                multiple={maxCount > 1}
                maxCount={maxCount}
                onRemove={onRemoveFile}
                customRequest={uploadServise}
                onChange={handleChange}
                {...rest}
              >
                <Button
                  disabled={disabled || readOnly}
                  icon={<UploadOutlined />}
                >
                  点击上传
                </Button>
              </Upload>
              <div className={styles.addon}>
                {placeholder && (
                  <div className={styles.desc}>{placeholder}</div>
                )}
                {templateSrc && (
                  <div className={styles.template}>
                    模板：
                    <a target="_blank" href={templateSrc}>
                      {templateName}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

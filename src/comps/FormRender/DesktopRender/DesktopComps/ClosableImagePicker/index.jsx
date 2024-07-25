import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Upload, Modal, message, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
    //acceptAll,
    disabled,
    limitSize,
    placeholder,
    addonText,
    readOnly,
    ...rest
  } = props;

  const [allowUpload, setAllowUpload] = useState(false);
  const maxSize = maxCount || 3;

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

  const [preview, setPreview] = useState({
    open: false,
    image: '',
    title: '',
  });

  const handleCancel = () => {
    setPreview({
      ...preview,
      open: false,
    });
  };

  const handlePreview = async (file) => {
    // if (acceptAll) {
    //   //可上传任意文件类型的情况下，点击让它直接下载
    //   window.open(file.url || file.response.flinkName);
    //   return;
    // }

    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }

    setPreview({
      url: `./FILE/files/preview?id=${file.id}`,
      open: true,
      title: file.name,
    });
  };

  const uploadButton = (
    <div className={styles.addBtn}>
      <PlusOutlined />
      <div className={styles.text}>{placeholder ?? '上传'}</div>
    </div>
  );

  const beforeUpload = (file) => {
    if (limitSize) {
      if (file.size > limitSize) {
        message.destroy();
        message.error('文件大小过大');
        return false;
      }
    }

    return true;
  };

  const handleChange = ({ file, fileList }) => {
    if (readOnly) return;
    setFiles(fileList);

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
          {!readOnly && (
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
          )}
          {allowUpload && (
            <div className={styles.uploadBox}>
              <Upload
                accept={accept || 'image/*'}
                disabled={disabled || readOnly}
                //action="./PROD/files/upload-urls"
                listType="picture-card"
                fileList={files}
                multiple={maxSize > 1}
                onPreview={handlePreview}
                onRemove={onRemoveFile}
                customRequest={uploadServise}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                {...rest}
              >
                {readOnly || disabled || files.length >= maxSize
                  ? null
                  : uploadButton}
              </Upload>
            </div>
          )}
        </div>
        {addonText && <div className={styles.desc}>{addonText}</div>}
      </div>
      <Modal
        open={preview.open}
        title={preview.title}
        footer={null}
        width={900}
        onCancel={handleCancel}
        centered
      >
        <div className={styles.imgBox}>
          <img className={styles.img} src={preview.url} />
        </div>
      </Modal>
    </>
  );
};

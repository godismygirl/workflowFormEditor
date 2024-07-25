import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Uploader, Switch } from 'react-vant';
import getFileMD5 from '@/utils/getFileMD5';
import axios from 'axios';
import styles from './styles.less';

const ImagePicker = ({
  value,
  onChange,
  limitSize,
  maxCount,
  disabled,
  readOnly,
}) => {
  const [allowUpload, setAllowUpload] = useState(false);
  const [files, setFiles] = useState([]);

  const onUploadFile = async (file) => {
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

    return {
      key: finalFileId,
      url: `./FILE/files/preview?id=${finalFileId}`,
      file,
    };
  };

  const onRemoveFile = (file) => {
    if (readOnly) return;
    const fileList = files.filter((el) => el.key !== file.key);
    setFiles(fileList);
    if (onChange) {
      onChange(fileList);
    }
  };

  const handleChange = (fileList) => {
    if (readOnly) return;
    setFiles(fileList);
    const result = fileList.map((el) => ({
      name: el.name ?? el.file?.name,
      id: el.id ?? el?.key,
    }));
    onChange?.(result);
  };

  useEffect(() => {
    if (value) {
      if (value?.length > 0) {
        const result = value?.map((el) => ({
          ...el,
          url: `./FILE/files/preview?id=${el.id}`,
        }));
        setFiles(result);
        setAllowUpload(true);
      } else {
        setAllowUpload(false);
      }
    }
  }, [value]);

  return (
    <div>
      <div className={styles.row}>
        <Switch
          checked={allowUpload}
          size={24}
          inactiveColor="#eee"
          onChange={(v) => {
            if (readOnly || disabled) return;
            //关闭时清空已上传文件
            setAllowUpload(v);
            if (!v) {
              setFiles([]);
              onChange?.([]);
            }
          }}
        />
        <span style={{ paddingLeft: 8 }}>
          {allowUpload ? '允许上传' : '禁止上传'}
        </span>
      </div>
      {allowUpload && (
        <div className={styles.uploadBox}>
          <Uploader
            value={files}
            disabled={disabled}
            readOnly={readOnly}
            maxSize={limitSize}
            maxCount={maxCount}
            onDelete={onRemoveFile}
            onChange={handleChange}
            upload={onUploadFile}
            isImageUrl={(f) => true}
          />
        </div>
      )}
    </div>
  );
};

export default ImagePicker;

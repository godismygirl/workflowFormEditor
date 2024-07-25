import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { Popup, Form, Notify, Button } from 'react-vant';
import { Uploader, Switch } from 'react-vant';
import getFileMD5 from '@/utils/getFileMD5';
import { Base64 } from 'js-base64';
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
  const [preview, setPreview] = useState({
    open: false,
    src: '',
  });
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
      name: file.name,
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
          disabled={disabled}
          size={24}
          inactiveColor="#eee"
          onChange={(v) => {
            //关闭时清空已上传文件
            if (readOnly || disabled) return;
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
            accept="*"
            value={files}
            disabled={disabled}
            maxSize={limitSize}
            maxCount={maxCount}
            readOnly={readOnly}
            onDelete={onRemoveFile}
            onChange={handleChange}
            upload={onUploadFile}
            // isImageUrl={(f) => {
            //   debugger;
            //   const isImage = f.file.type?.startsWith('image');
            //   return isImage;
            // }}
            //previewImage={false}
            isImageUrl={() => false}
            previewCoverRender={(item) => {
              return (
                item.name && (
                  <a
                    className={styles.cover}
                    href={item.url}
                    //onClick={() => {
                    // setPreview({
                    //   open: true,
                    //   src:
                    //     './PREVIEW/onlinePreview?url=' +
                    //     encodeURIComponent(Base64.encode(item.url)),
                    // });
                    //}}
                    // style={{
                    //   position: 'absolute',
                    //   bottom: 0,
                    //   width: ' 100%',
                    //   color: '#fff',
                    //   fontSize: 12,
                    //   textAlign: 'center',
                    //   background: '#00000030',
                    // }}
                  >
                    {item.name}
                  </a>
                )
              );
            }}
          />
        </div>
      )}
      <Popup
        title="文件预览"
        visible={preview.open}
        position="bottom"
        closeable
        className={styles.pop}
        onClose={() => setPreview({ open: false, src: '' })}
      >
        <iframe
          src={preview.src}
          frameborder="0"
          style={{
            width: '100%',
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'absolute',
          }}
        ></iframe>
      </Popup>
    </div>
  );
};

export default ImagePicker;

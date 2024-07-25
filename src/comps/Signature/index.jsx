import React, { useEffect, useRef } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';
import styles from './styles.less';

const Signature = ({ value, onChange, width, height }) => {
  const signRef = useRef();

  useEffect(() => {
    if (value) {
      signRef.current?.signaturePad.fromDataURL(value);
    } else {
      signRef.current?.signaturePad.clear();
    }
  }, [value]);

  useEffect(() => {
    signRef.current?.signaturePad?.addEventListener('endStroke', () => {
      const base64Str = signRef.current?.toDataURL();
      onChange?.(base64Str);
    });
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const canvas = signRef.current.canvasRef.current;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      signRef.current?.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={styles.signBox} style={{ width, height }}>
      <SignaturePad
        ref={signRef}
        options={{ backgroundColor: '#fff', border: '1px solid #ddd' }}
      />
    </div>
  );
};

export default Signature;

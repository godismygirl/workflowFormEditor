import React from 'react';
import styles from './styles.less';

const Page = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

const Header = ({ title, children }) => {
  return (
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      <div>{children}</div>
    </div>
  );
};

const Body = ({ children, style }) => {
  return (
    <div className={styles.body} style={style}>
      {children}
    </div>
  );
};

Page.Header = Header;
Page.Body = Body;

export default Page;

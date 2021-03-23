import React from 'react';
import Header from 'components/Header';

const Layout = props => (
  <div className="main">
    <Header />
    {/* 获取标签间内容的部分 */}
    {props.children}
  </div>
);

export default Layout;
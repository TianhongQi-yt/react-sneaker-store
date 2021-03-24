import React, { useMemo } from "react";
import Header from "components/Header";

const Layout = (props) => {

  // 根据 JWToken获取登录用户信息
    const user = useMemo(() => {
      return global.auth.getUser() || {};
    }, []);

  return (
    <div className="main">
      <Header user={user} />
      {/* 获取标签间内容的部分 */}
      {props.children}
    </div>
  );
};

export default Layout;

import React from "react";
import UserProfile from "components/UserProfile";
import panel from "components/Panel";
import { Link, withRouter } from "react-router-dom";

// 页眉函数组件
const Header = (props) => {
    // 将父组件 Layout的数据传给全局组件 panel
  const toProfile = () => {
    panel.open({
      component: UserProfile,
      props: {
          user: props.user
      },
      callback: (data) => {
          if (data === 'logout') {
              // 当前页面路由（刷新）
              props.history.go(0);
          }
      },
    });
  };
  return (
    <div className="header">
      <div className="grid">
        <div className="start">
          <Link to="/">Home</Link>
        </div>
        <div className="end">
          {/* 根据有登录用户信息 user渲染 Header视图 */}
          {props.user.username ? (
            <span className="nickname" onClick={toProfile}>
              <i className="fa fa-user-circle fa-fw fa-lg"></i>
              {props.user.username}
            </span>
          ) : (
            <React.Fragment>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header)
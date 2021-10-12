import React from "react";
import UserProfile from "components/UserProfile";
import panel from "components/Panel";
import { Link, withRouter } from "react-router-dom";

// 页眉
const Header = (props) => {
  const toProfile = () => {
    panel.open({
      component: UserProfile,
      props: {
        user: props.user,
      },
      callback: (data) => {
        if (data === "logout") {
          // 刷新
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

export default withRouter(Header);

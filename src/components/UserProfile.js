import React from "react";

const UserProfile = (props) => {

  // 登出 (移除JWToken)
  const logout = () => {
    localStorage.removeItem("jwToken");
    props.close("logout");
  };

  return (
    <div className="user-profile">
      <p className="title has-text-centered">Profile</p>
      <fieldset disabled>
        {/* 用户名 */}
        <div className="field">
          <div className="control">
            <label className="label has-text-left">Username</label>
            <input
              className="input"
              type="text"
              defaultValue={props.user.username}
            />
          </div>
        </div>
        {/* 邮箱 */}
        <div className="field">
          <div className="control">
            <label className="label has-text-left">Email</label>
            <input
              className="input"
              type="text"
              defaultValue={props.user.email}
            />
          </div>
        </div>
        {/* 用户类型 */}
        <div className="field">
          <div className="control">
            <label className="label has-text-left">Type</label>
            <input
              className="input"
              type="text"
              defaultValue={props.user.type === 1 ? "Manager" : "General User"}
            />
          </div>
        </div>
      </fieldset>
      <br />
      <br />
      <div className="field is-grouped is-grouped-centered">
        {/* Loout按钮 */}
        <div className="control">
          <button className="button is-danger" type="button" onClick={logout}>
            Logout
          </button>
        </div>
        {/* Cancel按钮 */}
        <div className="control">
          <button
            className="button"
            type="button"
            onClick={() => {
              this.props.close();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

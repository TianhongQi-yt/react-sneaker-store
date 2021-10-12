import React from "react";
import axios from "common/axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// 登陆
const Login = (props) => {
  const { register, handleSubmit, errors } = useForm();

  // 请求 JWT
  const onSubmit = async (user) => {
    try {
      const { email, password } = user;
      const res = await axios.post("/auth/login", { email, password });
      const jwToken = res.data;
      // 本地缓存 localStorage
      global.auth.setToken(jwToken);
      toast.success(`Welcome Back!`);
      props.history.push("/");
    } catch (error) {
      const errMessage = error.response.data.message;
      toast.error(errMessage);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="box login-box" onSubmit={handleSubmit(onSubmit)}>
        {/* 登录邮箱 */}
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className={`input ${errors.email && "is-danger"}`}
              type="text"
              placeholder="Email"
              name="email"
              ref={register({
                required: "Email is Required!",
                // 正则表达式
                pattern: {
                  value:
                    /^[A-Za-z0-9]+([_\\.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\.)+[A-Za-z]{2,6}$/,
                  message: "Invalid Email!",
                },
              })}
            />
            {errors.email && (
              <p className="helper has-text-danger">{errors.email.message}</p>
            )}
          </div>
        </div>
        {/* 登录密码 */}
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className={`input ${errors.password && "is-danger"}`}
              type="password"
              placeholder="Password"
              name="password"
              ref={register({
                required: "Password is Required!",
                minLength: {
                  value: 6,
                  message: "Password Cannot be Less than 6 Digits!",
                },
              })}
            />
            {errors.password && (
              <p className="helper has-text-danger">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        <div className="control">
          <button className="button is-fullwidth is-primary">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

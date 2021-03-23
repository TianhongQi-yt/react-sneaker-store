import React from "react";
import ReactDOM from "react-dom";
import Router from "router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "css/app.scss";
import "css/style.scss";

// 渲染进根节点元素
ReactDOM.render(
  <div>
    {/* 全局渲染通知组件 */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnVisibilityChange
      draggable
      pauseOnHover
    />
    <Router />
  </div>,
  document.querySelector("#root")
);

import React from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";

// 商品导航栏（搜索框，购物车）
class ToolBox extends React.Component {
  state = {
    searchText: "",
  };

  // 事件：获取搜索框中的内容
  handleChange = (e) => {
    // 获取当前合成事件的值
    const value = e.target.value;
    this.setState({
      searchText: value,
    });
    // 父子组件通信（props + callback函数模式）
    // 将搜索框中的 value传回父组件
    this.props.search(value);
  };

  // 事件：清除搜索框
  clearSearchText = () => {
    this.setState({
      searchText: "",
    });
    this.props.search("");
  };

  // 事件：跳转至购物车，未登录跳转登录页
  goCart = () => {
    if (!localStorage.getItem("jwToken")) {
      this.props.history.push("/login");
      toast.warn("Please Login First!");
      return;
    }
    this.props.history.push("/cart");
  };

  render() {
    return (
      <div className="tool-box">
        <div className="logo-text">
          <i className="fa fa-shopping-bag fa-fw"></i>Sneakers
        </div>
        {/* 搜索框 */}
        <div className="search-box">
          <div className="field has-addons">
            <div className="control">
              <input
                type="text"
                className="input search-input"
                placeholder="Search Product"
                value={this.state.searchText}
                onChange={this.handleChange}
              />
            </div>
            {/* 清除按钮 */}
            <div className="control">
              <button className="button" onClick={this.clearSearchText}>
                <i className="far fa-window-close fa-fw"></i>
              </button>
            </div>
          </div>
        </div>
        {/* 购物车，登陆后才能跳转购物车页面 */}
        <div to="/cart" className="cart-box" onClick={this.goCart}>
          <i className="fas fa-shopping-cart"></i>
          {/* 从父组件 Products中接收参数 cartNum */}
          <span className="cart-num">{this.props.cartNum}</span>
        </div>
      </div>
    );
  }
}

export default withRouter(ToolBox);

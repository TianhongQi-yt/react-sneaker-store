import React from "react";
import axios from "common/axios";
import panel from "components/Panel";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import EditInventory from "components/EditInventory";

// 单个商品信息组件
class Product extends React.Component {
  // 事件：打开弹出层，并修改商品信息
  // Product作为调用者，通过调用全局组件 panel的 open()方法，
  // 传入回调函数 callback 和 组件 EditInventory给弹出层
  editPanel = () => {
    panel.open({
      // 向全局组件 panel传入组件 EditInventory构造 (class)
      component: EditInventory,
      // 传入商品信息（父组件 Products的 state.products），用于渲染弹出层页面
      // 传入 delete函数（父组件 Products的 deleteProduct），用于弹出层删除 Product信息
      props: {
        product: this.props.product,
        delete: this.props.delete,
      },
      // 同时传入一个 callback函数，用于更新商品信息
      // 由于商品信息是父组件 Products的 state.products，所以回调函数使用父组件的 updateProduct
      callback: (data) => {
        if (data) this.props.update(data);
      },
    });
  };

  // 事件：添加购物车，未登录跳转登录页
  addCart = async () => {
    if (!localStorage.getItem("jwToken")) {
      this.props.history.push("/login");
      toast.warn("Please Login First!");
      return;
    }
    try {
      const user = global.auth.getUser() || {};
      const { id, name, image, price } = this.props.product;
      // 先根据 id判断购物车中是否有重复商品
      // 如果有的话只需数量 +1
      const res = await axios.get("/carts", {
        params: {
          productId: id,
          userId: user.email,
        },
      });
      const carts = res.data;
      if (carts && carts.length > 0) {
        const cart = carts[0];
        cart.amount++;
        await axios.put(`/carts/${cart.id}`, cart);
      } else {
        // 未重复，新添加商品
        const cart = {
          productId: id,
          name,
          image,
          price,
          amount: 1,
          userId: user.email,
        };
        await axios.post("/carts", cart);
      }
      toast.success("Add to Cart Successfully!");
      // 添加成功后，回调父组件 Products的 updateCartNum
      this.props.cartNum();
    } catch (error) {
      toast.error("Failed to Add to Cart!");
    }
  };

  // 辅助函数：登陆后渲染编辑商品按钮
  renderManagerBtn = () => {
    const user = global.auth.getUser() || {};
    // type类型 1为管理人员
    if (user.type === 1) {
      return (
        // 管理商品按钮(此处不是JSX，不能使用 JSX语法写注释)
        <div className="p-head has-text-right" onClick={this.editPanel}>
          <span className="icon edit-btn">
            <i className="fas fa-sliders-h"></i>
          </span>
        </div>
      );
    }
  };

  render() {
    const { name, image, tags, price, status } = this.props.product;
    const _pClass = {
      available: "product",
      unavailable: "product out-stock",
    };
    return (
      <div className={_pClass[status]}>
        <div className="p-content">
          {this.renderManagerBtn()}
          {/* image */}
          <div className="img-wrapper">
            <div className="out-stock-text">Out Of Stock</div>
            <figure className="image is-4by3">
              <img src={image} alt={name} />
            </figure>
          </div>
          {/* 标签 */}
          <p className="p-tags">{tags}</p>
          <p className="p-name">{name}</p>
        </div>
        {/* 价格，购物车 */}
        <div className="p-footer">
          <p className="price">$ {price}</p>
          <button
            className="add-cart"
            disabled={status === "unavailable"}
            onClick={this.addCart}
          >
            <i className="fas fa-cart-plus"></i>
            <i className="fas fa-exclamation"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Product);

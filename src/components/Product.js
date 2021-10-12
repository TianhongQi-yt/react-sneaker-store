import React from "react";
import axios from "common/axios";
import panel from "components/Panel";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import EditInventory from "components/EditInventory";

// 商品信息
class Product extends React.Component {
  // 打开弹出层，并修改商品信息
  editPanel = () => {
    panel.open({
      // 传入子组件 EditInventory
      component: EditInventory,
      props: {
        product: this.props.product,
        delete: this.props.delete,
      },
      // 更新商品信息
      callback: (data) => {
        if (data) this.props.update(data);
      },
    });
  };

  // 添加购物车
  addCart = async () => {
    // 未登录跳转登录页
    if (!localStorage.getItem("jwToken")) {
      this.props.history.push("/login");
      toast.warn("Please Login First!");
      return;
    }
    try {
      const user = global.auth.getUser() || {};
      const { id, name, image, price } = this.props.product;
      // 判断购物车中是否有重复商品
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
      this.props.cartNum();
    } catch (error) {
      toast.error("Failed to Add to Cart!");
    }
  };

  // 渲染编辑商品按钮
  renderManagerBtn = () => {
    const user = global.auth.getUser() || {};
    // type = 1为管理员
    if (user.type === 1) {
      return (
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
          {/* 图片 */}
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
        {/* 价格 &购物车 */}
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

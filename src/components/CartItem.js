import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "common/axios";

// 购物车商品信息组件（hooks函数式组件）
const CartItem = (props) => {
  // amount相当于类组件中的 state的属性，setAmount相当于 setState
  const [amount, setAmount] = useState(props.cart.amount);
  const { id, name, image, price } = props.cart || {};

  // 事件：监听购物车商品数量变化，并更新后台购物车数据
  const handleChange = async (event) => {
    const amount = parseInt(event.target.value);
    setAmount(amount);
    const newCart = {
      ...props.cart,
      amount,
    };
    await axios.put(`/carts/${id}`, newCart);
    // 父组件 Cart的回调函数更新购物车
    props.updateCart(newCart);
  };

  // 事件：删除产品
  const deleteCart = async () => {
    await axios.delete(`/carts/${id}`);
    props.deleteCart(props.cart);
    toast.warn("Delete Item!");
  };

  // 辅助函数：useMemo
  // 返回一个 memorized值，仅在某个依赖改变时才会重新计算 memorized值, 减少不必要的渲染
  // 类似类组件 shouldComponentUpdate
  const totalPrice = useMemo(() => {
      return price * amount
  }, [price, amount]);

  return (
    <div className="columns is-vcentered">
      {/* 删除按钮 */}
      <div className="column is-narrow" onClick={deleteCart}>
        <span className="close">
          <i className="far fa-times-circle"></i>
        </span>
      </div>
      {/* 图片 */}
      <div className="column is-narrow">
        <img src={image} alt={name} width="100" />
      </div>
      {/* 名称 */}
      <div className="column cart-name is-narrow">{name}</div>
      {/* 商品单价 */}
      <div className="column">
        <span className="price">$ {price}</span>
      </div>
      {/* 数量 */}
      <div className="column">
        <input
          type="number"
          className="input num-input"
          min={1}
          value={amount}
          onChange={handleChange}
        />
      </div>
      {/* 该商品总价 */}
      <div className="column">
        <span className="sum-price">$ {parseFloat(totalPrice.toFixed(5))}</span>
      </div>
    </div>
  );
};

export default CartItem;

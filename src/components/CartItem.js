import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "common/axios";

// 购物车商品信息
const CartItem = (props) => {
  const [amount, setAmount] = useState(props.cart.amount);
  const { id, name, image, price } = props.cart || {};

  // 购物车商品数量变化
  const handleChange = async (event) => {
    const amount = parseInt(event.target.value);
    setAmount(amount);
    const newCart = {
      ...props.cart,
      amount,
    };
    await axios.put(`/carts/${id}`, newCart);
    props.updateCart(newCart);
  };

  // 删除产品
  const deleteCart = async () => {
    await axios.delete(`/carts/${id}`);
    props.deleteCart(props.cart);
    toast.warn("Delete Item!");
  };

  // useMemo监听购物车价格变化
  const totalPrice = useMemo(() => {
    return price * amount;
  }, [price, amount]);

  return (
    <div className="columns is-vcentered">
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

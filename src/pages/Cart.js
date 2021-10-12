import React, { useState, useEffect, useMemo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Layout from "Layout";
import axios from "common/axios";
import CartItem from "components/CartItem";

// 购物车
const Cart = () => {
  const [carts, setCarts] = useState([]);

  // useEffect 页面刷新和第一次渲染查询购物车信息
  useEffect(() => {
    const user = global.auth.getUser() || {};
    axios.get(`/carts?userId=${user.email}`).then((res) => setCarts(res.data));
  }, []);

  // 计算总价格
  const totalPrice = useMemo(() => {
    const totalPrice = carts
      .map((cart) => cart.amount * cart.price)
      .reduce((a, value) => a + value, 0);
    return totalPrice;
  }, [carts]);

  // 更新购物车
  const updateCart = (cart) => {
    const newCarts = [...carts];
    const cartIndex = newCarts.findIndex((c) => c.id === cart.id);
    newCarts[cartIndex] = cart;
    setCarts(newCarts);
  };

  // 删除购物车
  const deleteCart = (cart) => {
    const newCarts = carts.filter((c) => c.id !== cart.id);
    setCarts(newCarts);
  };

  return (
    <Layout>
      <div className="cart-page">
        <span className="cart-title">
          <i className="fas fa-shopping-cart fa-fw"></i>
          Shopping Cart
        </span>
        {/* 购物车中的商品信息 */}
        <div className="cart-list">
          <TransitionGroup component={null}>
            {carts.map((cart) => (
              <CSSTransition classNames="cart-item" timeout={300} key={cart.id}>
                <CartItem
                  key={cart.id}
                  cart={cart}
                  updateCart={updateCart}
                  deleteCart={deleteCart}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
        {carts.length === 0 ? <p className="no-cart">Cart is Empty</p> : ""}
        <div className="cart-total">
          Total:
          {/* 精度丢失问题 toFixed(5)保留 5位小数 */}
          <span className="total-price">
            $ {parseFloat(totalPrice.toFixed(5))}
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;

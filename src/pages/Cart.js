import React, { useState, useEffect, useMemo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Layout from "Layout";
import axios from "common/axios";
import CartItem from "components/CartItem";

// React Hook 不编写 class的情况下使用 state及其他特性
const Cart = () => {
  // 定义 carts和 setCarts方法
  const [carts, setCarts] = useState([]);

  // 第一次渲染或每次更新后执行回调函数
  // useEffect(callback, [依赖])，依赖变化后会重新调用
  useEffect(() => {
    axios.get("/carts").then((res) => setCarts(res.data));
  }, []);

  // 辅助函数：计算总价格
  const totalPrice = useMemo(() => {
    console.log(1);
    const totalPrice = carts
      .map((cart) => cart.amount * cart.price)
      .reduce((a, value) => a + value, 0);
    return totalPrice;
  }, [carts]);

  // 回调函数：接收子组件 CartItem收据，更新并渲染购物车
  const updateCart = (cart) => {
    const newCarts = [...carts];
    const cartIndex = newCarts.findIndex((c) => c.id === cart.id);
    newCarts[cartIndex] = cart;
    setCarts(newCarts);
  };

  // 回调函数：接收子组件 CartItem数据，删除并渲染购物车
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
        {
          carts.length === 0 ? <p className="no-cart">Cart is Empty</p> : ''
        }
        <div className="cart-total">
          Total:
          {/* 精度丢失问题 toFixed(5)保留5位小时 */}
          <span className="total-price">$ {parseFloat(totalPrice.toFixed(5))}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;

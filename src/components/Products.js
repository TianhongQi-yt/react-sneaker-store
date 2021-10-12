import React from "react";
import axios from "common/axios";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ToolBox from "components/ToolBox";
import Product from "components/Product";
import panel from "components/Panel";
import AddInventory from "components/AddInventory";

// 全部商品信息
class Products extends React.Component {
  state = {
    products: [], // 当前商品信息
    sourceProducts: [], // 全部商品信息
    // 将 cartNum放入公共父组件 Products state中（状态提升），ToolBox和 Product可以互相通信
    cartNum: 0,
  };

  // 生命周期挂载后，请求后端数据
  componentDidMount() {
    axios.get("/products").then((response) => {
      this.setState({
        products: response.data,
        sourceProducts: response.data,
      });
    });
    this.updateCartNum();
  }

  // 搜索
  search = (text) => {
    const _products = this.state.sourceProducts.filter((p) => {
      const matchArray = p.name.match(new RegExp(text, "gi"));
      return matchArray !== null;
    });

    // 更新 state，驱动重新渲染
    this.setState({
      products: _products,
    });
  };

  // 打开弹出层，新增商品信息
  addPanel = () => {
    panel.open({
      // 传入子组件 AddInventory
      component: AddInventory,
      // 回调：用于监听新增商品信息，并更新state
      callback: (data) => {
        if (data) {
          const _products = [...this.state.products];
          _products.push(data);
          this.setState({
            products: _products,
            sourceProducts: _products,
          });
        }
      },
    });
  };

  // 更新一个商品
  updateProduct = (product) => {
    const _products = [...this.state.products];
    const upIndex = _products.findIndex((p) => {
      return p.id === product.id;
    });
    _products[upIndex] = product;
    this.setState({
      products: _products,
      sourceProducts: _products,
    });
  };

  // 删除一个 id的 product
  deleteProduct = (id) => {
    const _products = this.state.products.filter((p) => p.id !== id);
    this.setState({
      products: _products,
      sourceProducts: _products,
    });
  };

  // 更新购物车数量
  updateCartNum = async () => {
    const cartNum = await this.getCartNum();
    this.setState({
      cartNum: cartNum,
    });
  };

  // 获取购物车数量
  getCartNum = async () => {
    const user = global.auth.getUser() || {};
    const res = await axios.get("/carts", {
      params: {
        userId: user.email,
      },
    });
    const carts = res.data || [];
    const cartNum = carts
      .map((cart) => cart.amount)
      .reduce((acc, val) => acc + val, 0);
    return cartNum;
  };

  render() {
    return (
      <div>
        <ToolBox search={this.search} cartNum={this.state.cartNum} />
        <div className="products">
          <div className="columns is-multiline is-desktop">
            {/* null防止默认 div标签影响布局 */}
            <TransitionGroup component={null}>
              {this.state.products.map((product) => {
                return (
                  <CSSTransition
                    classNames="product-box"
                    timeout={300}
                    key={product.id}
                  >
                    <div className="column is-3" key={product.id}>
                      <Product
                        product={product}
                        update={this.updateProduct}
                        delete={this.deleteProduct}
                        cartNum={this.updateCartNum}
                      />
                    </div>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
          {(global.auth.getUser() || {}).type === 1 && (
            <button
              className="button is-primary add-btn"
              onClick={this.addPanel}
            >
              add
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Products;

import React from "react";
import axios from "common/axios";
import { CSSTransition, TransitionGroup } from "react-transition-group"; // React动画效果库
import ToolBox from "components/ToolBox";
import Product from "components/Product";
import panel from "components/Panel"; // 导入全局组件弹出层 panel
import AddInventory from "components/AddInventory"; // 需要被传递的子组件

// 全部商品信息组件
class Products extends React.Component {
  state = {
    products: [], // 当前商品信息
    sourceProducts: [], // 完整的商品信息
    // Product 和 ToolBox是兄弟组件
    // Products 是 ToolBox和 Product的公共父组件
    // 将 cartNum放入公共父组件 Products state中（状态提升），兄弟组件可以通过公共父组件通信
    cartNum: 0,
  };

  // 生命周期函数 - 组件渲染后
  componentDidMount() {
    // 向后端请求商品信息并更新 state
    axios.get("/products").then((response) => {
      this.setState({
        products: response.data,
        sourceProducts: response.data,
      });
    });
    // 同步更新购物车中组件数量
    this.updateCartNum();
  }

  // 事件：过滤当前商品信息 products，并重新渲染页面（搜索）
  search = (text) => {
    // 不可直接 state，先复制修改后在赋值
    const _products = this.state.sourceProducts.filter((p) => {
      // text是搜索框内容，找出符合条件的商品
      const matchArray = p.name.match(new RegExp(text, "gi"));
      return matchArray !== null;
    });

    this.setState({
      products: _products,
    });
  };

  // 事件：打开弹出层，并新增商品信息
  // Products 作为调用者，通过调用全局组件 panel的 open()方法，
  // 传入回调函数 callback 和 组件 AddInventory给弹出层
  addPanel = () => {
    panel.open({
      // 向全局组件 panel传入组件 AddInventory构造 (class)
      component: AddInventory,
      // 回调函数，用于监听新增商品信息，并更新state
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

  // 回调函数：更新一个 product
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

  // 回调函数：删除一个 id的 product
  deleteProduct = (id) => {
    const _products = this.state.products.filter((p) => p.id !== id);
    this.setState({
      products: _products,
      sourceProducts: _products,
    });
  };

  // 回调函数：更新购物车数量
  updateCartNum = async () => {
    const cartNum = await this.getCartNum()
    this.setState({
      cartNum: cartNum,
    });
  };

  // 辅助函数：获取购物车数量
  getCartNum = async () => {
    const res = await axios.get("/carts");
    const carts = res.data || [];
    const cartNum = carts
      .map((cart) => cart.amount)
      .reduce((acc, val) => acc + val, 0);
    return cartNum;
  };

  render() {
    return (
      <div>
        {/* 向 ToolBox子组件传参，绑定参数 search, cartNum */}
        <ToolBox search={this.search} cartNum={this.state.cartNum} />
        <div className="products">
          <div className="columns is-multiline is-desktop">
            {/* TansitionGroup包装一组组件，null防止生成默认 div标签影响布局 */}
            <TransitionGroup component={null}>
              {/* 通过 map(transform) 函数为每个 product传参 */}
              {this.state.products.map((product) => {
                return (
                  // 注意此处是 classNames
                  // timeout 动画延迟时间 ms
                  <CSSTransition
                    classNames="product-box"
                    timeout={300}
                    key={product.id}
                  >
                    {/* 单个产品信息组件 */}
                    <div className="column is-3" key={product.id}>
                      {/* 向子组件 Product中传递回调函数 */}
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
          {/* add按钮，绑定 addPanel事件，向子组件 AddInventory传入 callback函数和 AddInventory组件 */}
          <button className="button is-primary add-btn" onClick={this.addPanel}>
            add
          </button>
        </div>
      </div>
    );
  }
}

export default Products;

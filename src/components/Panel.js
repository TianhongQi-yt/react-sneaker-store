import React from "react";
import { render } from "react-dom";

/**  
    弹出层（class）
    1.全局渲染，导入即调用
    2.装载子组件 AddInventory, EditInventory
      (1) 子组件要作为参数传递给 panel并被渲染
        在 Products组件里调用 addPanel方法，通过 panael.open()，传递子组件 AddInventory给弹出层
        在 Product组件里调用 editPanel方法，通过 panael.open()，传递子组件 EditInventory给弹出层
      (2) 子组件也可以关闭弹出层
        在子组件 AddInventory, EditInventory中可以调用父组件 panel的 close()函数
      (3) 子组件与调用者可以通讯
        弹出层作为中间件，接收子组件的数据，通过回调函数返回给调用者（Products/Product）
 */
class Panel extends React.Component {
  state = {
    active: false, // 弹出层显示状态
    component: null, // 子组件
    callback: () => {}, // 调用者（Products/ Product）的回调函数
  };

  // 关闭弹出层
  close = (msg) => {
    this.setState({
      active: false,
    });
    // 根据子组件（AddInventory和 EditInventory）回调 close()方法传入的参数
    // 执行调用者（Products/ Product）的回调函数
    this.state.callback(msg);
  };

  // 打开弹出层
  open = (
    msg = {
      props: {},
      component: null,
      callback: () => {},
    }
  ) => {
    const { props, component, callback } = msg;
    // 利用时间戳为弹出层创建新的 key值，保证每次打开弹出层重新渲染
    const _key = new Date().getTime();
    const childComponent = React.createElement(component, {
      ...props,
      close: this.close,
      key: _key,
    });
    this.setState({
      active: true,
      component: childComponent,
      callback,
    });
  };

  render() {
    // 弹出层的显示和隐藏
    const panelActive = {
      true: "panel-wrapper active",
      false: "panel-wrapper",
    };
    return (
      <div className={panelActive[this.state.active]}>
        {/* 点击遮罩层，关闭弹出层 */}
        <div
          className="over-layer"
          onClick={() => {
            this.close();
          }}
        ></div>
        <div className="panel">
          <div className="head">
            {/* X按钮，关闭弹出层 */}
            <span
              className="close"
              onClick={() => {
                this.close();
              }}
            >
              X
            </span>
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

// 创建 div，渲染弹出层实例
const _div = document.createElement("div");
document.body.appendChild(_div);
const _panel = render(<Panel />, _div);
// 导出该实例
export default _panel;

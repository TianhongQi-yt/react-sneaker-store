import React from "react";
import { render } from "react-dom";

/**  
    弹出层 - 全局组件
    1.一次渲染，随需调用（全局渲染，导入即调用）
    2.可以装载组件（子组件 AddInventory, EditInventory）
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

  // 事件：关闭弹出层
  // msg是子组件回调 close()方法回传的参数
  close = (msg) => { 
    this.setState({
      active: false,
    });
    // 根据子组件（AddInventory和 EditInventory）回调 close()方法传入的参数
    // 执行调用者（Products/ Product）的回调函数
    this.state.callback(msg);
  };

  // 事件：打开弹出层
  open = (msg = { // 设置无参默认值
      props: {}, // Product接收的来自 Product的信息
      component: null,
      callback: () => {}
    }) => {
    // msg是全局组件 panel被调用 open方法接收的参数
    const { props, component, callback } = msg;
    // 利用时间戳为弹出层创建新的 key值
    // key值每次打开都不一样，都会重新渲染一次
    const _key = new Date().getTime();
    // 为 component创建子组件对象 childComponent并传参
    // panel 成为 childComponent(AddInventory和 EditInventory)的父组件
    const childComponent = React.createElement(component, {
      ...props, // 库存信息 和 delete callback
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
    // 通过 state.active控制弹出层的显示和隐藏
    const panelActive = {
      true: "panel-wrapper active",
      false: "panel-wrapper",
    };
    return (
      <div className={panelActive[this.state.active]}>
        {/* 弹出层左侧的遮罩层，关闭弹出层 */}
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
            {/* AddInventory 组件 */}
            {this.state.component}
          </div>
        </div>
      </div>
    );
  }
}

// 创建一个新的 html div元素，将弹出层组件渲染进该 div元素
const _div = document.createElement("div");
document.body.appendChild(_div);
// 返回弹出层的实例对象
const _panel = render(<Panel />, _div);
// 此时导出的不再是一个类，而是一个弹出层元素对象(div)
export default _panel;

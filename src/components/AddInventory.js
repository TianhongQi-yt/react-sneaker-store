import React from "react";
import axios from "common/axios";
import { toast } from "react-toastify";

// 新增库存组件
class AddInventory extends React.Component {
  state = {
    name: "",
    price: "",
    tags: "",
    image: "",
    status: "available",
  };

  // 事件：表单信息变化
  handleChange = (event) => {
    // 获取表单变化的 value和 name
    const value = event.target.value;
    const name = event.target.name;
    // 根据表单 name动态的设置 state值
    this.setState({
      [name]: value,
    });
  };

  // 事件：提交 form表单，创建新的商品信息
  submit = (event) => {
    event.preventDefault();
    const updateProducts = { ...this.state };
    // 通过 RESTful API的形式向后端新增数据
    axios.post("products", updateProducts).then((res) => {
      // 回调父组件 Panel中 close()方法，关闭弹出层，并回传新增的商品信息 res.data
      this.props.close(res.data);
      toast.success("Create Item Successfully!");
    });
  };

  render() {
    return (
      <div className="inventory">
        <p className="title has-text-centered">Inventory</p>
        {/* 表单主体 */}
        <form onSubmit={this.submit}>
          {/* 商品名称 */}
          <div className="field">
            <div className="control">
              <label className="label has-text-left">Name</label>
              {/* 区别于 html，使用 value属性对标签内容赋值 */}
              <textarea
                className="textarea"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* 价格 */}
          <div className="field">
            <div className="control">
              <label className="label has-text-left">Price</label>
              <input
                type="number"
                className="input"
                name="price"
                value={this.state.price}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* 标签信息 */}
          <div className="field">
            <div className="control">
              <label className="label has-text-left">Tags</label>
              <input
                type="text"
                className="input"
                name="tags"
                value={this.state.tags}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* 图片 */}
          <div className="field">
            <div className="control">
              <label className="label has-text-left">Image</label>
              <input
                type="text"
                className="input"
                name="image"
                value={this.state.image}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* 库存状态 */}
          <div className="field">
            <div className="control">
              <label className="label has-text-left">Status</label>
              <div className="select is-fullwidth">
                <select
                  name="status"
                  value={this.state.status}
                  onChange={this.handleChange}
                >
                  <option>available</option>
                  <option>unavailable</option>
                </select>
              </div>
            </div>
          </div>
          <br />
          <div className="field is-grouped is-grouped-centered">
            {/* Submit按钮 */}
            <div className="control">
              <button className="button is-link">Submit</button>
            </div>
            {/* cancel按钮，关闭弹出层 */}
            <div className="control">
              <button
                className="button"
                type="button"
                // 调用一个 空参方法，防止创建空商品
                onClick={() => {
                  this.props.close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AddInventory;

import React from "react";
import axios from "common/axios";
import { toast } from "react-toastify";

// 编辑库存组件
class EditInventory extends React.Component {
  state = {
    id: "",
    name: "",
    price: "",
    tags: "",
    image: "",
    status: "available",
  };

  componentDidMount() {
    const { id, name, image, tags, price, status } = this.props.product;
    this.setState({
      id,
      name,
      image,
      tags,
      price,
      status,
    });
  }

  // 事件：表单信息变化
  handleChange = (event) => {
    // 获取表单变化的 value和 name
    const value = event.target.value;
    const name = event.target.name;
    // 根据表单 name动态地为 state赋值
    this.setState({
      [name]: value,
    });
  };

  // 事件：提交 form表单，修改商品信息
  submit = (event) => {
    event.preventDefault();
    const updateProducts = { ...this.state };
    // 通过 RESTful API的形式向后端更新数据
    axios.put(`products/${this.state.id}`, updateProducts).then((res) => {
      // 回调父组件 Panel中 close()方法，关闭弹出层，并回传修改后的商品信息 res.data
      this.props.close(res.data);
      toast.info("Update Item Successfully!");
    });
  };

  // 事件：删除 Product
  onDelete = () => {
    // 通过 RESTful API的形式向后端删除数据
    axios.delete(`products/${this.state.id}`).then((res) => {
      // 回调父组件 panel中的 delete方法，依次回调给 Products
      this.props.delete(this.state.id);
      this.props.close();
      toast.warn("Delete Item!");
    });
  }

  render() {
    return (
      <div className="inventory">
        <p className="title has-text-centered">Inventory</p>
        {/* 表单主体 */}
        <form onSubmit={this.submit}>
          {/* name */}
          <div className="field">
            <div className="control">
              <label className="label has-text-left">Name</label>
              {/* textarea区别于 html，使用 value属性对标签内容赋值 */}
              <textarea
                className="textarea"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {/* price */}
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
          {/* Tags */}
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
          {/* Image */}
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
          {/* Status */}
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
              <button className="button is-link">Edit</button>
            </div>
            {/* Delete按钮 */}
            <div className="control">
              <button className="button is-danger" type="button" onClick={this.onDelete}>Delete</button>
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

export default EditInventory;

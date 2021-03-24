const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middleWares = jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use(middleWares);

// 辅助函数：请求数据库 user.json
const getUsersDb = () => {
  return JSON.parse(
    // 读取文件
    fs.readFileSync(path.join(__dirname, "users.json"), "UTF-8")
  );
};

// 辅助函数：查询数据库，匹配用户信息
const isAuthenticated = ({ email, password }) => {
  // 找不到返回 -1
  return (
    getUsersDb().users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
};

const SECRET = "12321JKLSJKLSDFJK23423432"; // 密钥
const expiresIn = "1h"; // 超时

// 辅助函数： 创建 JWT
const createToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // 校验成功，返回 JWT (Jason Web Token)给客户端
  if (isAuthenticated({ email, password })) {
    const user = getUsersDb().users.find(
      (user) => user.email === email && user.password === password
    );
    const { username, type } = user;
    const jwToken = createToken({ username, type, email });
    return res.status(200).json(jwToken);
  } else {
    const status = 401;
    const message = "Incorrect email or password";
    return res.status(status).json({ status, message });
  }
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});

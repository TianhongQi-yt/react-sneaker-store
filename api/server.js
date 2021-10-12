const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middleWares = jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use(middleWares);

// 模拟请求数据库 user.json
const getUsersDb = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "users.json"), "UTF-8")
  );
};

// 模拟查询数据库
const isAuthenticated = ({ email, password }) => {
  return (
    getUsersDb().users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
};

const SECRET = "12321JKLSJKLSDFJK23423432"; // 密钥
const expiresIn = "1h"; // 超时

// 创建创建 token
const createToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

// 登录 api
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // 校验成功，返回 JWT
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

// 注册 api
server.post("/auth/register", (req, res) => {
  const { email, password, username, type } = req.body;

  // 校验是否注册
  if (isAuthenticated(email)) {
    const status = 401;
    const message = "Tihs Email has been registed!";
    return res.status(status).json({ status, message });
  }

  // 模拟入库
  fs.readFile(path.join(__dirname, "users.json"), (err, _data) => {
    if (err) {
      const status = 401;
      const message = err;
      return res.status(status).json({ status, message });
    }
    const data = JSON.parse(_data.toString());
    const last_item_id = data.users[data.users.length - 1].id;
    data.users.push({ id: last_item_id + 1, email, password, username, type });
    fs.writeFile(
      path.join(__dirname, "users.json"),
      JSON.stringify(data),
      (err, result) => {
        if (err) {
          const status = 401;
          const message = err;
          res.status(status).json({ status, message });
          return;
        }
      }
    );
  });

  const jwToken = createToken({ username, type, email });
  res.status(200).json(jwToken);
});

/**
将 JWT放在 http headers中
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJuaWNrbmFtZSI6ImFkbWluIiwidHlwZSI6MSwiZW1haWwiOiJhZG1pbkAxNjMuY29tIiwiaWF0IjoxNTcyNzU3MjAzLCJleHAiOjE1NzI3NjA4MDN9
.f4hfN1IjU4E23Lo44N-2VLzc1qoyNu1oZg2iQreZTfU
*/

// 验证 token
const verifyToken = (token) => {
  return jwt.verify(token, SECRET, (err, decode) =>
    decode !== undefined ? decode : err
  );
};

// 中间件，验证 token
server.use("/carts", (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Error in authorization format";
    res.status(status).json({ status, message });
    return;
  }
  try {
    const verifyTokenResult = verifyToken(
      req.headers.authorization.split(" ")[1]
    );
    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = "Access token not provided";
      res.status(status).json({ status, message });
      return;
    }
    next();
  } catch (err) {
    const status = 401;
    const message = "Error token is revoked";
    res.status(status).json({ status, message });
  }
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});

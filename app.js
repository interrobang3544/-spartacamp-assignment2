const express = require("express");
const app = express();
const port = 8080;

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");

app.use(express.json());
app.use("/", [postsRouter, usersRouter,commentsRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
})
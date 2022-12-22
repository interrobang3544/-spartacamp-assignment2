const express = require("express");
const app = express();
const port = 8080;
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", [postsRouter, usersRouter,commentsRouter]);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
})
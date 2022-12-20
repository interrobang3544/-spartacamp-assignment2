const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");


router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  const existsUsers = await User.findAll({ where: { nickname }});
  try{
    if (existsUsers.length) {
      res.status(412).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
  
    if (password !== confirm) {
      res.status(412).send({
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
      return;
    }
  
    const nicknameCheck = /^[A-Za-z0-9]{3,}$/;
    if (!nicknameCheck.test(nickname)) {
      res.status(412).send({
        errorMessage: "ID의 형식이 일치하지 않습니다.",
      });
      return;
    }
  
    if (password.length < 4) {
      res.status(412).send({
        errorMessage: "패스워드 형식이 일치하지 않습니다.",
      });
      return;
    }
  
    if (password.indexOf(nickname) === 0) {
      res.status(412).send({
        errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
    return;
  } 

  await User.create({ nickname, password });
  res.status(201).send({
    "message": "회원 가입에 성공하였습니다.",
  });
});

router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({
    where: {
      nickname,
    },
  });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || password !== user.password) {
    res.status(412).send({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
  });
});

module.exports = router;
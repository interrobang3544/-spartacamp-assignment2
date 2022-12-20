const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

//게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const { userId, nickname } = res.locals.user

  await Post.create({ userId, nickname, title, content });

  res.json({ message: "게시글을 생성하였습니다." });
});

// 게시글 조회
router.get("/posts", async (req, res) => {
  const posts = await Post.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: ['postId', 'nickname', 'title', 'createdAt', 'updatedAt', 'likes'],
  });

  res.json({
    data: posts
  });
});

// 게시글 상세 조회
router.get("/posts/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const post = await Post.findOne({
     where: { postId: _postId },
     attributes: ['postId', 'nickname', 'title', 'content', 'createdAt', 'updatedAt', 'likes'],
    });

  res.json({
    data: post
  });
});

// 게시글 수정
router.put("/posts/:_postId", authMiddleware, async (req, res) => {
  const { _postId } = req.params;
  const { title, content } = req.body;
  
  if ( !title || !content) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    return;
  }

  const post = await Post.findOne({ where: { postId: _postId }});
  if (post === null) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    return;
  }

  await Post.update({ title, content }, { where: { postId: _postId }});
  res.json({ message: "게시글을 수정하였습니다." });
})

// 게시글 삭제
router.delete("/posts/:_postId", async (req, res) => {
  const { _postId } = req.params;

  const post = await Post.findOne({ where: { postId: _postId }});
  if (post === null) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    return;
  }

  await Post.destroy({ where: { postId: _postId }});
  res.json({ message: "게시글을 삭제하였습니다." });
});

module.exports = router;
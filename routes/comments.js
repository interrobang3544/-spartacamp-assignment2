const express = require("express");
const Comments = require("../schemas/comments")
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

// 댓글 생성
router.post("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;
  const createdAt = new Date();

  if (!content) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  } else if (!user || !password) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  await Comments.create({ _postId, user, password, content, createdAt });

  res.json({ message: "댓글을 생성하였습니다." });
  
});


// 댓글 목록 조회
router.get("/comments/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const comments = await Comments.find({ _postId }).sort({ createdAt: -1 });

  const results = comments.map((comment) => {
		return {
      commentId: comment.id,
			user: comment.user,
			content: comment.content,
      createdAt: comment.createdAt
		};
  });

  res.json({
    data: results
  });
});

// 댓글 수정
router.put("/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;
  if (!content) {
    res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    return;
  }

  try {
    const comments = await Comments.find({ _id: ObjectId(_commentId) });
    if (comments.length === 0) {
      res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      return;
    }
    if (password !== comments[0].password) {
      res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      return;
    } else {
      await Comments.updateOne({ _id: ObjectId(_commentId) }, { $set: { password, content } });
    }
  } catch (err) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    return;
  }

  res.json({ message: "댓글을 수정하였습니다." });
})

// 댓글 삭제
router.delete("/comments/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;

  try {
    const comments = await Comments.find({ _id: ObjectId(_commentId) });
    if (comments.length === 0) {
      res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
      return;
    }
    if (password !== comments[0].password) {
      res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
      return;
    } else {
      await Comments.deleteOne({ _id: ObjectId(_commentId) });
    }
    
  } catch (err) {
    res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
    return;
  }

  res.json({ message: "댓글을 삭제하였습니다." });
});

module.exports = router;
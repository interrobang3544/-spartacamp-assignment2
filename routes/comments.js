const express = require("express");
const router = express.Router();
const { Comment, User } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 생성
router.post("/comments/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user

    if (!comment) {
      res.status(412).json({ 
        message: "댓글 내용을 입력해주세요." 
      });
      return 
    }
    
    await Comment.create({ postId, userId, comment });
    res.json({
       message: "댓글을 생성하였습니다." 
      });
  } catch (err) {
    res.status(400).send({
      errorMessage: "댓글 작성에 실패하였습니다.",
    });
    return;
  }
});

// 댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      attributes: ['commentId', 'userId', 'comment', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          attributes: ['nickname']
        }
      ],
      where: { postId },
      order: [
        ['createdAt', 'DESC']
      ],
    });
    
    const results = comments.map((comment) => {
      return {
        commentId: comment.commentId,
        userId: comment.userId,
        nickname: comment.User.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });

    res.json({
      data: results
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "댓글 조회에 실패하였습니다.",
    });
    return;
  }
});

router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user
    const comments = await Comment.findOne({ where: { commentId }});
  
    if (comment === null) {
      res.status(404).json({ 
        message: "댓글이 존재하지 않습니다." 
      });
      return;
    }
    if (comments.userId !== userId) {
      res.status(401).json({ 
        message: "본인이 작성한 댓글만 수정할 수 있습니다." 
      });
      return;
    }
    if (!comment) {
      res.status(412).json({ 
        message: "댓글 내용을 입력해주세요." 
      });
      return;
    }
  
    await Comment.update({ comment }, { where: { commentId }});
    res.json({
       message: "댓글을 수정하였습니다." 
      });
  } catch (err) {
    res.status(400).send({
      errorMessage: "댓글 수정에 실패하였습니다.",
    });
    return;
  }
})

// 댓글 삭제
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = res.locals.user
    const comments = await Comment.findOne({ where: { commentId }});
  
    if (comments === null) {
      res.status(404).json({ 
        message: "댓글이 존재하지 않습니다." 
      });
      return;
    }
    if (comments.userId !== userId) {
      res.status(401).json({ 
        message: "본인이 작성한 댓글만 수정할 수 있습니다." 
      });
      return;
    }
  
    await Comment.destroy({ where: { commentId }});
    res.json({ 
      message: "게시글을 삭제하였습니다." 
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "댓글 삭제에 실패하였습니다.",
    });
    return;
  }
});

module.exports = router;
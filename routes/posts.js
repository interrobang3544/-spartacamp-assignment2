const express = require("express");
const router = express.Router();
const { Post, User, Like } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

//게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = res.locals.user

    if (!title || !content) {
      return res.status(412).json({ 
        message: "데이터 형식이 올바르지 않습니다." 
      });
    }

    await Post.create({ userId, title, content });
    res.json({ 
      message: "게시글 작성에 성공하였습니다."
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "게시글 작성에 실패하였습니다.",
    });
    return;
  }
});

// 게시글 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['postId', 'title', 'createdAt', 'updatedAt', 'likes'],
      include: [
        {
          model: User,
          attributes: ['nickname']
        }
      ],
      order: [
        ['createdAt', 'DESC']
      ],
    });
    const results = posts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.User.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes
      };
    });

    res.json({
      data: results
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
    return;
  }
});

// 좋아요 게시글 조회
router.get("/posts/like", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user
    const user = await User.findOne({
      where: { userId },
      include: [
        {
          model: Post,
          as: "Liked",
          attributes: ['postId', 'title', 'createdAt', 'UpdatedAt', 'likes'],
        }
      ]
    });
  
    const results = user.Liked.map((post) => {
      return {
        postId: post.postId,
        userId: user.userId,
        nickname: user.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes
      }
    });
    
    res.json({
      data: results
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "좋아요 게시글 조회에 실패하였습니다.",
    });
    return;
  }
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({
       attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt', 'likes'],
       include: [
        {
          model: User,
          attributes: ['nickname']
        }
      ],
      where: { postId },
      });
    const results = {
        postId: post.postId,
        nickname: post.User.nickname,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likes: post.likes
    };
      
    res.json({
      data: results
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
    return;
  }
});

// 게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals.user
    const post = await Post.findOne({ where: { postId }});

    if (post === null) {
      res.status(404).json({ 
        message: "게시글이 존재하지 않습니다." 
      });
      return;
    }
    if (post.userId !== userId) {
      res.status(401).json({ 
        message: "본인이 작성한 게시글만 수정할 수 있습니다." 
      });
      return;
    }
    if ( !title || !content) {
      res.status(412).json({ 
        message: "데이터 형식이 올바르지 않습니다." 
      });
      return;
    }

    await Post.update({ title, content }, { where: { postId }});
    res.json({
        message: "게시글을 수정하였습니다." 
      });
  } catch (err) {
    res.status(400).send({
      errorMessage: "게시글 수정에 실패하였습니다.",
    });
    return;
  }
})

// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user
    const post = await Post.findOne({ where: { postId }});

    if (post === null) {
      res.status(404).json({ 
        message: "게시글이 존재하지 않습니다." 
      });
      return;
    }
    if (post.userId !== userId) {
      res.status(401).json({ 
        message: "본인이 작성한 게시글만 삭제할 수 있습니다." 
      });
      return;
    }

    await Post.destroy({ where: { postId }});
    res.json({ 
      message: "게시글을 삭제하였습니다." 
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "게시글 삭제에 실패하였습니다.",
    });
    return;
  }
});


// 게시글 좋아요
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user
    const post = await Post.findOne({ where: { postId }});
    const like = await Like.findOne({ where: { postId, userId }});

    if (post === null) {
      res.status(404).json({ 
        message: "게시글이 존재하지 않습니다." 
      });
      return;
    }
    if (like === null) {
      const likes = post.likes + 1
  
      await Like.create({ postId, userId });
      await Post.update({ likes }, { where: { postId }});
      res.json({ 
        message: "게시글의 좋아요를 등록하였습니다." 
      });
    } else {
      const likes = post.likes - 1
  
      await Like.destroy({ where: { postId, userId }});
      await Post.update({ likes }, { where: { postId }});
      res.json({ 
        message: "게시글의 좋아요를 취소하였습니다." 
      });
    }
  } catch (err) {
    res.status(400).send({
      errorMessage: "게시글 좋아요에 실패하였습니다.",
    });
    return;
  }
})

module.exports = router;
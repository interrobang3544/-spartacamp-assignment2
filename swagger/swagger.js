const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
      version: "1.0.0",
      title: "나만의 항해 블로그 백엔드 서버",
      description: "회원가입, 로그인, 댓글 추가/수정/삭제 기능이 추가된 블로그"
  },
  tags: [
      {
          "name": "User",
          "description": "유저 생성"
      },
      {
          "name": "Post",
          "description": "게시글 생성 조회 수정 삭제"
      },
      {
          "name": "Comment",
          "description": "댓글 생성 조회 수정 삭제"
      },
  ],
}

const outputFile = './swagger_output.json' 
const endpointsFiles = ['./routes/users.js', './routes/posts.js', './routes/comments.js'] 

swaggerAutogen(outputFile, endpointsFiles, doc);
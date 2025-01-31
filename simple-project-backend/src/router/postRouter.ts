import { tokenVerify } from './../middleware/tokenVerify';
import { upload } from "../multer"
const express = require('express')
const postRouter = express()
const postController = require('../controller/postController')

postRouter.post('/posts', tokenVerify, upload.array('media', 5), postController.createPost)
postRouter.get('/posts/:id', postController.getPosts)
postRouter.get('/my-posts/:id', tokenVerify, postController.getMyPosts)
postRouter.delete('/my-posts/:pid', tokenVerify, postController.deletePost)
postRouter.put('/my-posts/:pid', tokenVerify, postController.editPost)

module.exports = postRouter
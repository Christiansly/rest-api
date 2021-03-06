const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/is-auth')
const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);
router.get('/post/:postId', isAuth, feedController.getPost)
// POST /feed/post
router.post(
  '/post',
  [
    body('title')
      .trim()
      .isLength({ min: 7 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ], isAuth,
  feedController.createPost
);

router.put('/post/:postId', [
  body('title')
      .trim()
      .isLength({ min: 7 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
], isAuth, feedController.updatePost)

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router;
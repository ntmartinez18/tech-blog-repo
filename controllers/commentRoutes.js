const router = require('express').Router();
const { Post, User, Comment } = require('./models');

// create a new comment
router.post('/', async (req, res) => {
    try {
      const commentData = await Comment.create({
        content: req.body.content,
        post_id: req.body.post_id,
        user_id: req.body.user_id
      });
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// update a comment by id
router.put('/:id', async (req, res) => {
    try {
      const commentData = await Comment.update(
        {
          content: req.body.content,
          post_id: req.body.post_id,
          user_id: req.body.user_id
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (commentData[0] === 0) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }
      res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

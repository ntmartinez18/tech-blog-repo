const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


// get all comments
router.get('/', async (req, res) => {
    try {
      const commentData = await Comment.findAll({
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Post,
            include: [User],
          },
        ],
      });
      res.render('homepage', { comments: commentData });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// create a new comment
  router.post('/:id/comment', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.create({
        content: req.body.content,
        user_id: req.body.user_id,
        post_id: req.params.id,
      });
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// update a comment by id
router.put('/:id/comment', withAuth, async (req, res) => {
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

// delete a comment by id
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!commentData) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;

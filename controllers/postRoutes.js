const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


// Render homepage with existing blog posts
router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            include: [User],
          },
        ],
      });
      res.render('homepage', { posts: postData });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Render individual blog post with comments
router.get('/post/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            include: [User],
          },
        ],
      });
      res.render('post', { post: postData });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// create a new post
  router.post('/', withAuth, async (req, res) => {
    try {
      const postData = await Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.body.user_id
      });
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// update a post by id
router.put('/:id', withAuth, async (req, res) => {
    try {
      const postData = await Post.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (postData[0] === 0) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
      res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// delete a post by id
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const postData = await Post.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!postData) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;
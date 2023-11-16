const router = require('express').Router();
const { Post, User, Comment } = require('./models');

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
  router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

  // Create a new comment
router.post('/:id/comment', async (req, res) => {
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

  module.exports = router;
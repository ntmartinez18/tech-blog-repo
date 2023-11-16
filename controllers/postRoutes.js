const router = require('express').Router();
const { Post } = require('./models');

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

// update a post
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
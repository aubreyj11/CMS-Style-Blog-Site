const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'postText', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostInfo => res.json(dbPostInfo))
    .catch(err => {
        res.status(500).json(err);
    });
});

router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'postText', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostInfo => {
        if(!dbPostInfo) {
            res.status(404).json({message: 'No post with this ID can be found'});
            return;
        }
        res.json(dbPostInfo);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req,res) => {
    Post.create({
        title: req.body.title,
        postText: req.body.postText,
        user_id: req.session.user_id
    })
    .then(dbPostInfo => res.json(dbPostInfo))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update(
      {
        title: req.body.title,
        postText: req.body.postText
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostInfo => {
        if (!dbPostInfo) {
          res.status(404).json({ message: 'No post with this ID can be found' });
          return;
        }
        res.json(dbPostInfo);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.delete('/:id', withAuth, (req,res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostInfo => {
        if(!dbPostInfo) {
            res.status(404).json({message: 'No post with this ID can be found'});
            return;
        }
        res.json(dbPostInfo);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;
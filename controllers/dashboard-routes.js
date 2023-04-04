const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'postText', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'commentText', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostInfo => {
        const posts = dbPostInfo.map(post=> post.get({plain:true}));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
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
                attributes: ['id', 'commentText', 'post_id', 'user_id', 'created_at'],
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
        const post = dbPostInfo.get({plain:true});
        res.render('update-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.get('/new', (req,res) => {
    res.render('new-post');
});

module.exports = router; 
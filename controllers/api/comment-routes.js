const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbCommentInfo => res.json(dbCommentInfo))
    .catch(err => {
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req,res) => {
    if(req.session) {
        Comment.create({
            commentText: req.body.commentText,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
        .then(dbCommentInfo => res.json(dbCommentInfo))
        .catch(err => {
            res.status(500).json(err);
        });
    }
});

router.delete('/:id', (req,res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentInfo => {
        if(!dbCommentInfo) {
            res.status(404).json({message: 'No comment with this ID can be found'});
            return;
        }
        res.json(dbCommentInfo);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
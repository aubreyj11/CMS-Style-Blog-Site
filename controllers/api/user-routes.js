const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// find all users
router.get('/', (req,res) => {
    User.findALl({
        attributes: {exclude: ['password']}
    })
    .then(dbUserInfo=> res.json(dbUserInfo))
    .catch(err => {
        res.status(500).json(err);
    });
});

//find user by id number
router.get('/:id', (req,res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'postText', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at']
            }
        ]
    })
    .then(dbUserInfo => {
        if(!dbUserInfo) {
            res.status(404).json({message: 'No user with this ID can be found'});
            return;
        }
    })
    .catch (err => {
        res.status(500).json(err);
    });
});

// create user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUserInfo => {
        req.session.save(() => {
            req.session.user_id = dbUserInfo.id;
            req.session.username = dbUserInfo.username;
            req.session.loggedIn = true;

            res.json(dbUserInfo)
        })
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

//user login
router.post('/login', (req, res) => {
    console.log(req.body.username);
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(dbUserInfo => {
        if(!dbUserInfo) {
            res.status(400).json({ message: 'Username not found'});
            return;
        }
        const validPw = dbUserInfo.checkPassword(req.body.password);
        if(!validPw) {
            res.status(400).json({ message: 'Incorrect Password' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserInfo.id;
            req.session.username = dbUserInfo.username;
            req.session.loggedIn = true;
            res.json({user: dbUserInfo, message: 'You are logged in!'});
        });
    })
    .catch (err => {
        console.log(err);
    });
});

//logout
router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        })
    } else {
        res.status(404).end();
    }
});

//update user
router.put('/:id', (req,res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserInfo => {
        if(!dbUserInfo[0]) {
            res.status(404).json({message: 'No user with this ID'});
            return;
        }
        res.json(dbUserInfo);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

//delete user
router.delete('/:id', (req, res)=> {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserInfo => {
        if (!dbUserInfo) {
            res.status(404).json({message: 'No user with this ID'})
        }
        res.json(dbUserInfo);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
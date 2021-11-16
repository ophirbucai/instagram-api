const { base64StringToBlob } = require('blob-util');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const usersController = require('../controllers/users.controller');
const postsController = require('../controllers/posts.controller');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/').pop();
        const fileName = (Math.random() + 1).toString(36).substring(7);
        cb(null, fileName + '.' + extension);
    }
});
const upload = multer({ storage });


const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    try {
        const user = jwt.verify(token, 'top-secret');
        req.userId = user.id;
        next();
    } catch (err) {
        console.log(err);
        res.status(403).send();
    }
};

router.post('/post/:id/like', auth, postsController.like);
router.post('/post/:id/unlike', auth, postsController.unlike);
router.post('/post/:id/comment', auth, postsController.createComment);
router.get('/post/:id/comment', auth, postsController.getAllComments);
router.get('/post/:id', auth, postsController.getOne);
router.get('/post', auth, postsController.getAll);
router.post('/post', auth, upload.single('image'), postsController.create);

router.get('/user/me', auth, usersController.me);
router.post('/user', usersController.create);
router.post('/user/available', usersController.isAvailable);
router.get('/user/:username', auth, usersController.getUser);
router.get('/search/user/:q', auth, usersController.search);
router.post('/user/:username/follow', auth, usersController.follow);
router.post('/user/:username/unfollow', auth, usersController.unfollow);
router.get('/user/post/:username', auth, postsController.getPosts);

router.post('/sign-in', usersController.login);
router.get('/health', (req, res) => {
    res.sendStatus(200);
});


module.exports = router;
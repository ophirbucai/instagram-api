const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const postsController = require('../controllers/posts.controller');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const fileName = (Math.random() + 1).toString(36).substring(7);
        cb(null, fileName + '.' + extension);
    }
});
const upload = multer({ storage });

const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    try {
        const user = jwt.verify(token, 'shahar');
        req.userId = user.id;
        next();
    } catch (err) {
        console.log(err);
        res.status(403).send();
    }
};

router.get('/user/me', auth, usersController.me);
router.post('/post', auth, upload.single('image'), postsController.create);
router.get('/post', postsController.getAll);
router.post('/user', usersController.create);
router.post('/user/available', usersController.isAvailable);
router.post('/login', usersController.login);
router.get('/health', (req, res) => {
    res.sendStatus(200);
});


module.exports = router;
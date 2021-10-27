const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postScheme = new mongoose.Schema({
    body: {
        type: String,
    },
    likes: {
        type: Array,
        default: () => []
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    image: {
        type: String,
        required: true
    }
});

const Post = mongoose.model('post', postScheme);

module.exports = Post;
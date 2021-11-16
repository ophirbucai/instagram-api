const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    }
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
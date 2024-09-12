const mongoose = require('mongoose');
const userModel = require('./model');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: userModel 
    }
}, {
    timestamps: true
})

const blogModel = mongoose.model('blogModel', blogSchema)

module.exports = blogModel;
const express = require('express');
const { viewBlog, createBlog } = require('../controller/blogController');
const router = express.Router();


router.get('/view', viewBlog)

router.post('/create', createBlog)

module.exports = router;
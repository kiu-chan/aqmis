const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', postsController.addPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.post('/:id/view', postsController.incrementViewCount);  // Thêm route mới cho việc tăng lượt xem

module.exports = router;
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, reviewsController.createReview);
router.delete('/:id', authenticateToken, reviewsController.deleteReview);
router.get('/given/:userId', reviewsController.getGivenReviews);
router.get('/received/:userId', reviewsController.getReceivedReviews);

module.exports = router;

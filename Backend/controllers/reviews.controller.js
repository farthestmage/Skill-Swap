const Reviews = require('../Database/reviews.model');

exports.createReview = async (req, res) => {
    try {
        const { reviewed_user_id, rating, message, request_id, request_type } = req.body;
        const reviewer_user_id = req.user.id;
        const reviewId = await Reviews.create({ reviewer_user_id, reviewed_user_id, rating, message, request_id, request_type });
        res.status(201).json({ id: reviewId, message: 'Review created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Reviews.delete(id);
        if (success) {
            res.status(200).json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGivenReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Reviews.getGivenByUserId(userId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReceivedReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Reviews.getReceivedByUserId(userId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
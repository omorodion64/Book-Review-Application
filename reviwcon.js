const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

exports.getReviewsByBook = async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await Review.find({ book: id }).populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = new Review({
      book: id,
      user: req.user.userId,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

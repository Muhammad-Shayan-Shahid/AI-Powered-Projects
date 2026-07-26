const express = require('express');
const reviewController = require('../controllers/review.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { createReviewSchema } = require('../validator/review.validator');

const router = express.Router();

router.post('/', verifyToken, requireRole('patient'), validate(createReviewSchema), reviewController.createReview);

module.exports = router;

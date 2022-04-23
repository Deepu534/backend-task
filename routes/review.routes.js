const express = require("express");
const router = express.Router();
const {
  findAllReviews,
  createReview,
  findOneReview,
  updateReview,
  deleteReview,
  searchReviews,
} = require("../controller/review.controller.js");

const { verifyToken } = require("../middleware/auth.token.js");

router.get("/search", searchReviews);
router.get("/", findAllReviews);
router.get("/:id", findOneReview);
router.post("/", verifyToken, createReview);
router.put("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;

const Review = require("../model/review.js");
const Movie = require("../model/movie.js");

exports.findAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong",
    });
  }
};

exports.createReview = async (req, res) => {
  console.log("req.userId in create review", req.userId);
  try {
    const newReview = new Review({
      ...req.body,
      postedBy: req.userId,
    });
    const savedReview = await newReview.save();
    Movie.updateOne(
      { _id: req.body.movie },
      { $push: { reviews: savedReview._id } }
    )
      .then(() => {
        console.log("saved review");
      })
      .catch((e) => {
        console.log("error while saving review");
      });
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong with creating the actor",
    });
  }
};

exports.findOneReview = async (req, res) => {
  const { id } = req.params;
  try {
    const currentReview = await Review.findById(id);
    if (!currentReview)
      return res.status(404).json({
        message: `review with id ${id} does not exist 😒😒`,
      });
    return res.status(200).send(currentReview);
  } catch (error) {
    res.status(500).json({
      message: error.message || "error while getting the actor",
    });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Review.findByIdAndDelete(id);
    res.json({
      message: `Review with title "${data.title}" is deleted sucessuly`,
    });
  } catch (error) {
    res.status(500).json({
      message: `cannot delete the review with ${id}`,
    });
  }
};

exports.updateReview = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  const updates = Object.keys(req.body);
  try {
    const updatedReview = await Review.findOne({ _id });
    if (!updatedReview) {
      return res.status(404).send();
    }
    await updates.forEach(
      (update) => (updatedReview[update] = req.body[update])
    );
    await updatedReview.save();
    res.send(updatedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `cannot update the review`,
    });
  }
};

exports.searchReviews = async (req, res) => {
  const { searchQuery } = req.query;
  if (!searchQuery) {
    return res.status(400).send({
      error: "A query is required to perform search",
    });
  }

  try {
    const result = await Review.find({
      $text: { $search: searchQuery, $caseSensitive: false },
    }).exec(function (err, docs) {
      if (err) {
        console.log(err);
        return res.status(500).send({
          error: "something went wrong while searching reviews",
        });
      }

      return res.status(200).send(docs);
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: "something went wrong while performing search",
    });
  }
};

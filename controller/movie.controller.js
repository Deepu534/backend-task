const movie = require("../model/movie.js");
const Actor = require("../model/actor.js");
var mongoose = require("mongoose");

exports.findallmovies = async (req, res) => {
  try {
    const books = await movie.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong",
    });
  }
};

exports.createmovie = async (req, res) => {
  const { name, director, actors } = req.body;
  try {
    const newMovie = new movie({
      name,
      director,
      actors: actors && actors.length > 0 ? actors : [],
    });
    const movieSaved = await newMovie.save();
    if (actors && actors.length > 0) {
      let ids = actors.map((actorId) => mongoose.Types.ObjectId(actorId));
      Actor.updateMany(
        { _id: { $in: ids } },
        { $push: { movies: movieSaved._id } }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    res.json(movieSaved);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong with creating the movie",
    });
  }
};

exports.findonemovie = async (req, res) => {
  const { id } = req.params;
  try {
    const current_movie = await movie.findById(id);
    if (!current_movie)
      return res.status(404).json({
        message: `movie with id ${id} does not exist 😒😒`,
      });
    return res.status(200).send(current_movie);
  } catch (error) {
    res.status(500).json({
      message: error.message || "error while getting the movie",
    });
  }
};

exports.deletemovie = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await movie.findByIdAndDelete(id);
    console.log("Deleted", data._id);
    if(data.actors && data.actors.length > 0)
    {
            let ids = data.actors.map((actorId) => mongoose.Types.ObjectId(actorId));
            Actor.updateMany(
              { _id: { $in: ids } },
              { $pull: { movies: data._id } }
            )
              .then((res) => {
                console.log(res);
              })
              .catch((e) => {
                console.log(e);
              });
    }
    res.json({
      message: `${data.name} movie is deleted sucessully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `cannot delete the movie with ${id}`,
    });
  }
};

exports.updatemovie = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  const updates = Object.keys(req.body);
  try {
    const updatedMovie = await movie.findOne({ _id });
    if (!updatedMovie) {
      return res.status(404).send();
    }
    await updates.forEach(
      (update) => (updatedMovie[update] = req.body[update])
    );
    await updatedMovie.save();
    res.send(updatedMovie);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `cannot update the movie`,
    });
  }
};

exports.searchMovie = async (req, res) => {
  const { searchQuery } = req.query;
  console.log(searchQuery);
  if (!searchQuery) {
    return res.status(400).send({
      error: "A query is required to perform search",
    });
  }

  try {
    const result = await movie.find({
      $text: { $search: searchQuery, $caseSensitive: false },
    }).exec(function (err, docs) {
      if (err) {
        return res.status(500).send({
          error: "something went wrong while searching movies",
        });
      }

      return res.status(200).send(docs);
    });
  } catch (e) {
    res.status(500).send({
      error: "something went wrong while performing search",
    });
  }
};

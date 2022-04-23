const Actor = require("../model/actor.js");
const Movie = require("../model/movie.js");
var mongoose = require("mongoose");

exports.findAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong",
    });
  }
};

exports.createActor = async (req, res) => {
  const { name, age, movies } = req.body;
  try {
    const newActor = new Actor({
      name,
      age,
      movies: movies && movies.length > 0 ? movies : [],
    });
    const savedActor = await newActor.save();
    if (movies && movies.length > 0) {
      let ids = movies.map((movieId) => mongoose.Types.ObjectId(movieId));
      Movie.updateMany(
        { _id: { $in: ids } },
        { $push: { actors: savedActor._id } }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    res.json(savedActor);
  } catch (error) {
    res.status(500).json({
      message: error.message || "something went wrong with creating the actor",
    });
  }
};

exports.findOneActor = async (req, res) => {
  const { id } = req.params;
  try {
    const currentActor = await Actor.findById(id);
    if (!currentActor)
      return res.status(404).json({
        message: `actor with id ${id} does not exist 😒😒`,
      });
    return res.status(200).send(currentActor);
  } catch (error) {
    res.status(500).json({
      message: error.message || "error while getting the actor",
    });
  }
};

exports.deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Actor.findByIdAndDelete(id);
    if (data.movies && data.movies.length > 0) {
      let ids = data.movies.map((movieId) => mongoose.Types.ObjectId(movieId));
      Movie.updateMany({ _id: { $in: ids } }, { $pull: { actors: data._id } })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    res.json({
      message: `${data.name} actor is deleted sucessuly`,
    });
  } catch (error) {
    res.status(500).json({
      message: `cannot delete the actor with ${id}`,
    });
  }
};

exports.updateActor = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  const updates = Object.keys(req.body);
  try {
    const updatedActor = await Actor.findOne({ _id });
    if (!updatedActor) {
      return res.status(404).send();
    }
    await updates.forEach(
      (update) => (updatedActor[update] = req.body[update])
    );
    await updatedActor.save();
    res.send(updatedActor);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `cannot update the actor`,
    });
  }
};


exports.searchActor = async (req, res) => {

  const { searchQuery } = req.query
  console.log(searchQuery);
  if(!searchQuery)
  {
    return res.status(400).send({
      "error": "A query is required to perform search"
    })
  }

  try{
    const result = await Actor.find({ $text: { $search: searchQuery, $caseSensitive: false } })
       .exec(function(err, docs) { 
         if(err)
         {
           return res.status(500).send({
             "error": "something went wrong while searching actors"
           })
         }

         return res.status(200).send(docs);
        })
  }
  catch(e){
    res.status(500).send({
      "error": "something went wrong while performing search"    
    })
  }
}

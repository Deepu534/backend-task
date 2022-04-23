const mongoose = require("mongoose");
const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ]
});

actorSchema.index({ name: "text" });

module.exports = mongoose.model("Actor", actorSchema);

const mongoose = require('mongoose')
const mongodb = process.env.MONGO_URL || "mongodb://localhost:27017/imdb";
mongoose.connect(mongodb, {
    useNewUrlParser: true,

    useUnifiedTopology: true
})

mongoose.Promise = global.Promise
module.exports = mongoose
const express = require('express')
const morgan = require('morgan')
const mongoose = require('./config/database.js')
const pkg = require('./package.json')

const authroutes = require('./routes/auth.routes')
const bookroutes = require('./routes/movie.routes')
const actorrouters = require('./routes/actor.routes')
const reviewRouter = require('./routes/review.routes')
const port = process.env.PORT || 3000
const app = express()
    //DB settings
mongoose.connection.on('error', console.error.bind(console, 'DB Connection Error'))
    //set
app.set('pkg', pkg)
    //middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.json({
    author: app.get("pkg").author,
    name: app.get("pkg").name,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

//routes
app.use('/api/auth', authroutes)
app.use('/api/movies', bookroutes)
app.use('/api/actors', actorrouters)
app.use("/api/reviews", reviewRouter);
    //welcome route

app.listen(port, () => {
    console.log(`server running on port : ${port}`)
})
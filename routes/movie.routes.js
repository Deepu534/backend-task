const express = require('express')
const router = express.Router()
const { findallmovies, findonemovie, createmovie, updatemovie, deletemovie, searchMovie } = require('../controller/movie.controller.js')

const {
    verifyToken
} = require('../middleware/auth.token.js')

router.get("/search", searchMovie);
router.get("/", findallmovies);
router.get("/:id", findonemovie);
router.post("/", verifyToken, createmovie);
router.put("/:id", verifyToken, updatemovie);
router.delete("/:id", verifyToken, deletemovie);

module.exports = router
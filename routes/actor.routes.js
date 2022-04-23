const express = require("express");
const router = express.Router();
const {
  findAllActors,
  createActor,
  findOneActor,
  updateActor,
  deleteActor,
  searchActor
} = require("../controller/actor.controller.js");

const { verifyToken } = require("../middleware/auth.token.js");

router.get("/search", searchActor);
router.get("/", findAllActors);
router.get("/:id", findOneActor);
router.post("/", verifyToken, createActor);
router.put("/:id", verifyToken, updateActor);
router.delete("/:id", verifyToken, deleteActor);

module.exports = router;

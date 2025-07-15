const express = require("express");
const Note = require("../models/Note");
const router = express.Router();

router.post("/", async (req, res) => {
  const note = await Note.create(req.body);
  res.json(note);
});

router.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

router.put("/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content, updatedAt: Date.now() },
    { new: true }
  );
  res.json(note);
});

module.exports = router;

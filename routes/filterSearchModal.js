"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/filterSearchModal");

router.post("/", controller.filterMovies);

module.exports = router;

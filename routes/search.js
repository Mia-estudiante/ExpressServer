"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/search");

router.post("/", controller.searchWord);

module.exports = router;

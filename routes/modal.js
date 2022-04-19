"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/modal");

router.post("/", controller.searchContent);

module.exports = router;

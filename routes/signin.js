"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/signin");

router.post(
  "/",
  controller.checkID,
  controller.checkPW,
  controller.updateTable,
  controller.addToken
);

module.exports = router;

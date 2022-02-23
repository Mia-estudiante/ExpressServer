"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/signin");

router.post(
  "/",
  controller.getUserInfo,
  controller.checkID,
  controller.checkPW
);

module.exports = router;

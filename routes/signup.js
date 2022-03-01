"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/signup");

router.post("/", controller.insertUserInfo, controller.insertUserEncrypt);

module.exports = router;

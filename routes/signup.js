"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/signup");

router.post(
  "/",
  controller.getUserInfo,
  controller.insertUserInfo,
  controller.checkValidEmail
);

//동기처리!!
// router.use(getUserInfo);
// router.use(checkValidEmail);
// router.use(insertUserInfo);

//2. 회원가입
// router.post("/signup", (req, res) => {
//   /////////////////////////////////

//   ////////////////////////////////
//   // console.log("checking After " + isValidEmail); //실행순서 1

//   //3. user_encrypt - id, pw, salt 기록 -> 암호화
//   console.log("4");
// });

module.exports = router;

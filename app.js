"use strict";

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const PORT = 8080;
// const whitelist = ["https://mia-estudiante.github.io/WebSite/"];

require("dotenv").config();
// app.use(cors({ origin: whitelist }));
app.use(cors());
app.use(express.json());

const emailCheckRouter = require("./routes/emailCheck"); //DB에 이메일 존재 여부 확인
const verifiCodeRouter = require("./routes/verificode"); //인증번호 전송
const checkVerifiCodeRouter = require("./routes/checkVerifiCode"); //인증번호 확인
const signUpRouter = require("./routes/signup"); //회원가입 - DB에 저장
const signInRouter = require("./routes/signin"); //로그인 - 연산

app.use("/emailCheck", emailCheckRouter);
app.use("/verificode", verifiCodeRouter);
app.use("/checkVerifiCode", checkVerifiCodeRouter);
app.use("/signup", signUpRouter);
app.use("/signin", signInRouter);

app.listen(PORT, console.log("app listening"));

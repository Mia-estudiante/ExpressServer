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

//MySQL 연결
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST, //mysql ip
//   user: process.env.DB_USER,
//   password: process.env.DB_PW,
//   port: parseInt(process.env.DB_PORT),
//   database: process.env.DB_NAME,
// });
// module.exports = connection;

const emailCheckRouter = require("./routes/emailCheck"); //DB에 이메일 존재 여부 확인
const signUpRouter = require("./routes/signup"); //회원가입 - DB에 저장
const signInRouter = require("./routes/signin"); //로그인 - 연산

app.use("/emailCheck", emailCheckRouter);
app.use("/signup", signUpRouter);
app.use("/signin", signInRouter);

app.listen(PORT, console.log("app listening"));

"use strict";

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const PORT = 8080;
const redis = require("redis");
// const whitelist = ["https://mia-estudiante.github.io/WebSite/"];

require("dotenv").config();
// app.use(cors({ origin: whitelist }));
app.use(cors());
app.use(express.json());

/**
 * redis 연결
 */
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
});
client.connect();

app.use((req, res, next) => {
  req.client = client;
  next();
});

const emailCheckRouter = require("./routes/emailCheck"); //DB에 이메일 존재 여부 확인
const verifiCodeRouter = require("./routes/verificode"); //인증번호 전송
const checkVerifiCodeRouter = require("./routes/checkVerifiCode"); //인증번호 확인
const signUpRouter = require("./routes/signup"); //회원가입 - DB에 저장
const signInRouter = require("./routes/signin"); //로그인 - 연산
const searchRouter = require("./routes/search"); //직접 검색 - 웹 스크랩핑
const modalRouter = require("./routes/modal"); //특정 영화 관련 정보

app.use("/emailCheck", emailCheckRouter);
app.use("/verificode", verifiCodeRouter);
app.use("/checkVerifiCode", checkVerifiCodeRouter);
app.use("/signup", signUpRouter);
app.use("/signin", signInRouter);
app.use("/search", searchRouter);
app.use("/modal", modalRouter);

//404 응답은 단순히 실행해야 할 추가적인 작업이 없다는 것을 의미
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

//next 메소드로 전달받은 err 핸들링
app.all("*", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(PORT, console.log("app listening"));

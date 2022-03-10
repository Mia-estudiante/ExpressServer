"use strict";

const redis = require("redis");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();

/**
 * redis 연결
 */
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
});
client.connect();

const checkVerifiCode = async (req, res, next) => {
  const id = sanitizeHtml(req.body.id);
  const code = sanitizeHtml(req.body.code);
  console.log(id, code);

  const realCode = await client.get(`${id}`, redis.print);

  code === realCode ? next() : res.json({ result: false });
};

/**
 * 인증 완료시 인증번호 삭제
 * - 데이터 낭비 방지
 */
const delKey = async (req, res, next) => {
  const id = sanitizeHtml(req.body.id);
  const result = await client.del(`${id}`, redis.print);
  result === 1 ? res.json({ result: true }) : res.json({ result: false });
};

module.exports = {
  checkVerifiCode,
  delKey,
};

"use strict";

const redis = require("redis");
const sanitizeHtml = require("sanitize-html");

const checkVerifiCode = async (req, res, next) => {
  const id = sanitizeHtml(req.body.id);
  const code = sanitizeHtml(req.body.code);
  console.log(id, code);

  const realCode = await req.client.get(`${id}`, redis.print);

  code === realCode ? next() : res.json({ result: false });
};

/**
 * 인증 완료시 인증번호 삭제
 * - 데이터 낭비 방지
 */
const delKey = async (req, res, next) => {
  const id = sanitizeHtml(req.body.id);
  const result = await req.client.del(`${id}`, redis.print);
  result === 1 ? res.json({ result: true }) : res.json({ result: false });
};

module.exports = {
  checkVerifiCode,
  delKey,
};

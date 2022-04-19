"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const sanitizeHTML = require("sanitize-html");
const puppeteer = require("puppeteer");
const { json } = require("express");

//영화 정보 페이지
const getHTML = async (link) => {
  try {
    return await axios.get(`${link}`);
  } catch (err) {
    console.log(err);
  }
};

const searchContent = async (req, res, next) => {
  //let jsonArray = new Array(); //객체들을 담아서 보낼 배열
  // const title = sanitizeHTML(req.body.word);

  const link = sanitizeHTML(req.body.link);
  const html = await getHTML(link);
  const $ = cheerio.load(html.data);
  const movieInfo = $(".info_spec > dd > p").children("span");
  let content = new Object();

  for (const info of movieInfo) {
    const href = $(info).find("a").attr("href");
    if (href) {
      if (href.includes("genre")) {
        //1.장르
        const genres = $(info).children("a");
        content.genre = new Array();
        for (const genre of genres) {
          content.genre.push($(genre).text());
        }
      }
      if (href.includes("nation")) {
        //2.국적
        content.nation = $(info).find("a").text();
      }
      if (href.includes("open")) {
        //3.개봉일자
        const regex = /[^0-9]/g;
        const opens = $(info).children("a");
        const length = opens.length;
        content.date = $(opens[length - 1])
          .attr("href")
          .replace(regex, "");
      }
    } else {
      // 4. 러닝타임
      content.time = $(info).text().split(" ").join("");
    }
  }
  //5. 줄거리
  content.story = $(".story_area > .con_tx").text();
  console.log(content);
  res.json({ content: content });
};

module.exports = {
  searchContent,
};

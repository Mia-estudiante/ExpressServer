"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const sanitizeHTML = require("sanitize-html");
const puppeteer = require("puppeteer");
const { json } = require("express");

//첫 번째 페이지
const getHTML = async (title) => {
  try {
    return await axios.get(
      `https://movie.naver.com/movie/search/result.naver?section=movie&query=${encodeURI(
        title
      )}&page=1`
    );
  } catch (err) {
    console.log(err);
  }
};

//다음 페이지..
const pageHTML = async (count, title) => {
  try {
    return await axios.get(
      `https://movie.naver.com/movie/search/result.naver?section=movie&query=${encodeURI(
        title
      )}&page=${count}`
    );
  } catch (err) {
    console.log(err);
  }
};

function returnPromise(jsonArray, movie, $) {
  //then -> resolove를 통해 데이터를 받음
  //then -> reject는 에러를 받음
  return new Promise((resolve, reject) => {
    let json = new Object();
    //1. 영화 상세 페이지 링크
    json.link =
      "https://movie.naver.com" + $(movie).find("dl dt a").attr("href");
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.goto(`https://movie.naver.com${link}`);
    // const src = await page.$eval(".poster > a > img", (ele) => ele.src);
    const smallImgSrc = $(movie).find("p > a > img").attr("src");
    const typePos = $(movie).find("p > a > img").attr("src").indexOf("type");

    //2. 영화 이미지 링크
    json.imgSrc = smallImgSrc.slice(undefined, typePos);

    //3. 영화 토픽
    json.title = $(movie).find("dl dt").text();
    // console.log(json);
    jsonArray.push(json);
    resolve(jsonArray);
  });
}

const searchWord = async (req, res, next) => {
  let jsonArray = new Array(); //객체들을 담아서 보낼 배열
  const title = sanitizeHTML(req.body.word);
  const html = await getHTML(title);
  const $ = cheerio.load(html.data);

  const text = $(".search_header .num").text().replace(/ /g, "");
  const var1 = text.replace(/ /g, "").indexOf("/");
  const var2 = text.replace(/ /g, "").indexOf("건");
  const count = parseInt(text.substring(var1 + 1, var2));
  const totalPage = parseInt(count / 10) + 1;

  for (let i = 1; i <= totalPage; i++) {
    const html = await pageHTML(i, title);
    const $ = cheerio.load(html.data);
    const movies = $(".search_list_1").first().children("li");

    await Promise.all(
      $(movies).each(async (idx, movie) => {
        returnPromise(jsonArray, movie, $);
      })
    );
  }
  res.json({ movies: jsonArray });
};

module.exports = {
  searchWord,
};

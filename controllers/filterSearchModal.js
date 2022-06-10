"use strict";
const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");

//영화 상세페이지
const contentHTML = async (link) => {
  try {
    return await axios.get(link);
  } catch (err) {
    console.log(err);
  }
};

const returnPromise = async (movies, idx, $) => {
  return await new Promise(async (resolve, reject) => {
    let json = new Object();

    //1. 영화 상세 페이지 링크
    json.link =
      "https://movie.naver.com" + $(movies[idx]).find("li a").attr("href");

    //2. 영화 토픽
    json.title = $(movies[idx]).children("a").text();

    //3. 영화 이미지 링크 - 직접 영화 상세 페이지 링크에 들어가야 함..
    const contentHtml = await contentHTML(json.link);
    const $$ = cheerio.load(contentHtml.data);
    const imgSrc = $$(".poster > a > img").attr("src");
    if (!imgSrc) {
      json.imgSrc = "";
    } else {
      const typePos = $$(".poster > a > img").attr("src").indexOf("type");
      json.imgSrc = imgSrc.slice(0, typePos);
    }
    resolve(json);
  });
};

const filterMovies = async (req, res, next) => {
  // { genre: 1, open: 2010, nation: 'GR' }
  // const genre = req.body.genre;
  // const open = req.body.open;
  // const nation = req.body.nation;

  let jsonArray = new Array();
  const genre = req.body.json.genre;
  const open = req.body.json.open;
  const nation = req.body.json.nation;

  //1. 브라우저 실행
  const browser = await puppeteer.launch({
    headless: true,
  });

  //2. 새페이지 오픈
  const page = await browser.newPage();

  //3. 필터 기반 검색된 url 접속 - nation, open, genre
  await page.goto(
    `https://movie.naver.com/movie/sdb/browsing/bmovie.naver?nation=${encodeURI(
      nation
    )}&open=${encodeURI(open)}&genre=${encodeURI(genre)}&page=1`
  );

  // await page.waitForSelector(".directory_list");
  let repeat = false;
  let count = 0;
  do {
    await page.waitForSelector(".directory_list");
    // let repeat = false;
    count++;
    const content = await page.content();
    const $ = cheerio.load(content);
    const movies = $(".directory_list").children("li");

    const arr = Object.keys(movies).slice(0, movies["length"]);
    const map1 = arr.map((idx) => returnPromise(movies, idx, $));

    const work = await Promise.all(map1)
      .then((res) => {
        // console.log(res);
        res.forEach((item, idx, arr) => {
          jsonArray.push(item);
        });
        return res;
      })
      .catch((err) => {
        console.log(err, "에러");
      });

    await page
      .click(".next")
      .then((res) => {
        repeat = true;
      })
      .catch((err) => {
        repeat = false;
      });
  } while (repeat === true);
  res.json({ movies: jsonArray });
};

module.exports = {
  filterMovies,
};

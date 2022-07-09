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
    console.log($(movies[idx]).children("a").text());

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
    console.log(json);
    resolve(json);
  });
};

const returnSitePromise = async (page, genre, open, nation) => {
  //   console.log(page);
  //   console.log(genre, open, nation);
  if (open !== 0) {
    await page.goto(
      `https://movie.naver.com/movie/sdb/browsing/bmovie.naver?nation=${encodeURI(
        nation
      )}&open=${encodeURI(open)}&genre=${encodeURI(genre)}&page=1`
    );
  } else {
    console.log("페이지 오픈");
    await page.goto(
      `https://movie.naver.com/movie/sdb/browsing/bmovie.naver?nation=${encodeURI(
        nation
      )}&genre=${encodeURI(genre)}&page=1`
    );
  }

  let repeat = false;
  let count = 0;

  let jsonArray = new Array();

  do {
    await page.waitForSelector(".directory_list");
    count++;
    const content = await page.content();
    const $ = cheerio.load(content);

    const movies = $(".directory_list").children("li");
    const arr = Object.keys(movies).slice(0, movies["length"]);
    // console.log(arr);
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

    //존재 유무로 T/F를 판단
    if ($("#old_content > div.pagenavigation > table > tbody > tr > td.next")) {
      await page
        .click(
          "#old_content > div.pagenavigation > table > tbody > tr > td.next"
        )
        .then((res) => {
          repeat = true;
        })
        .catch((err) => {
          repeat = false;
        });
    } else {
      repeat = false;
    }
  } while (repeat === true);
  //   return work;
  // console.log(jsonArray);
  return jsonArray;
};

const filterMovies = async (req, res, next) => {
  // { genre: 1, open: 2010, nation: 'GR' }
  // const genre = req.body.genre;
  // const open = req.body.open;
  // const nation = req.body.nation;

  const genre = req.body.json.genre;
  const open = req.body.json.open;
  const nation = req.body.json.nation;
  console.log(genre, open, nation);

  //1. 브라우저 실행
  const browser = await puppeteer.launch({
    headless: true,
  });

  /**
   * 경우의 수('개봉년대' 기준)
   * 1. '개봉년대' 선택안함(open===0)
   * 2. '개봉년대' 선택(open!==0)
   * 1) 1940년대~1980년대(open.toString().length===3)
   * 2) 1990년대~2020년대(open.toString().length===4)
   */
  if (open !== 0) {
    switch (open.toString().length) {
      case 3: //3자리일 때, 네이버 영화 디렉토리를 통해 - 1940년대~1980년대(194~198)
        //2. 새페이지 오픈
        const page = await browser.newPage();

        //3. 필터 기반 검색된 url 접속 - nation, open, genre
        let siteMap1 = [];
        siteMap1.push(returnSitePromise(page, genre, open, nation));

        const work2 = await Promise.all(siteMap1)
          .then((res) => {
            let result = [];
            res.forEach((x) => {
              if (Array.isArray(x) && x.length === 0) return;
              x.forEach((ele) => result.push(ele));
            });
            return result;
          })
          .catch((err) => {
            console.log(err, "에러");
          });

        // const result1 = returnSitePromise(page, genre, open, nation);
        // console.log(result1);
        res.json({ movies: work2 });
        break;
      case 4: //4자리일 때, 직접 년대 계산 - 1990년대~2020년대
        const TEN = 10;
        //2. 새페이지 오픈
        let arr = [];
        for (let i = 0; i < TEN; i++) {
          arr.push(browser.newPage());
        }

        /**
         * const arr = new Array(TEN).fill(browser.newPage());
         */

        const pages = await Promise.all(arr);
        const opens = [...Array(TEN).keys()].map((key) => key + open);
        // console.log(opens);
        const dictionary = {};
        for (let i = 0; i < TEN; i++) {
          dictionary[opens[i]] = pages[i];
        }

        //3. 필터 기반 검색된 url 접속 - nation, open, genre
        let siteMap = [];
        for (let open in dictionary) {
          siteMap.push(
            returnSitePromise(dictionary[open], genre, open, nation)
          );
        }

        const work1 = await Promise.all(siteMap)
          .then((res) => {
            let result = [];
            res.forEach((x) => {
              if (Array.isArray(x) && x.length === 0) return;
              x.forEach((ele) => result.push(ele));
            });
            return result;
          })
          .catch((err) => {
            console.log(err, "에러");
          });

        res.json({ movies: work1 });
        break;
      default:
        console.log("에러 발생");
    }
  } else {
    //2. 새페이지 오픈
    const page = await browser.newPage();

    //3. 필터 기반 검색된 url 접속 - nation, open, genre
    let siteMap1 = [];
    siteMap1.push(returnSitePromise(page, genre, open, nation));

    const work2 = await Promise.all(siteMap1)
      .then((res) => {
        let result = [];
        res.forEach((x) => {
          if (Array.isArray(x) && x.length === 0) return;
          x.forEach((ele) => result.push(ele));
        });
        return result;
      })
      .catch((err) => {
        console.log(err, "에러");
      });

    // const result1 = returnSitePromise(page, genre, open, nation);
    // console.log(result1);
    res.json({ movies: work2 });
  }
};

module.exports = {
  filterMovies,
};

"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const sanitizeHTML = require("sanitize-html");

const getHTML = async (word) => {
  try {
    const html = await axios.get(
      `https://movie.naver.com/movie/search/result.naver?query=${encodeURI(
        word
      )}&section=all&ie=utf8`
    );
    return html;
  } catch (err) {
    console.log(err);
  }
};

const searchWord = async (req, res, next) => {
  const html = await getHTML(sanitizeHTML(req.body.word));
  const $ = cheerio.load(html.data);
  const movies = $(".search_list_1").children("li");
  let images = [];
  movies.each((idx, movie) => {
    const img = $(movie).find("p a img").attr("src");
    images.push(img);
  });
  res.json({ images: images });
};

module.exports = {
  searchWord,
};

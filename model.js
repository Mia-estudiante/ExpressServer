/**
 * 모델 자동 생성 모듈(<-> sequelize cli)
 * - model을 먼저 작성하지 않고 DB를 먼저 작성한 후에 실행함으로써
 *   DB정보가 모델에 역으로 저장
 * - DB 내 모든 테이블을 모델로 생성
 */
const SequelizeAuto = require("sequelize-auto");
require("dotenv").config();

const auto = new SequelizeAuto(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PW,
  {
    host: process.env.DB_HOST, // DB Host 주소
    port: process.env.DB_PORT, // 포트 번호
    dialect: "mysql", // 사용하는 DBMS 종류
  }
);

auto.run((err) => {
  if (err) throw err;
});

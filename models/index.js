"use strict";

/**
 * 1. config 디렉토리 - DB 설정 파일(env 파일 사용 -> config.js)
 * 2. models 디렉토리 - DB 내 테이블 정보 및 필드 타입 정의하고 하나의 객체로 모음
 *  - config/config.json 내 DB 설정을 읽어
 *    시퀄라이즈 생성 후 models 디렉토리 내 model들을 db 객체에 정의
 *  - MySQL과 매핑될 객체
 * 3. migration 디렉토리 - DB 변화 과정 추적
 * 4. seedeers 디렉토리 - 테이블에 기본 데이터를 넣고 싶은 경우 사용
 * */

/**
 * index.js에서 sequelizeAuto로 만든 모델과 mysql 테이블을 서로 연결
 */
const initModels = require("./init-models");
const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

//Sequelize를 통해 MySQL 연결 객체를 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 모델과 테이블간의 관계가 맺어짐
const models = initModels(sequelize);

module.exports = models;

// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.js")[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

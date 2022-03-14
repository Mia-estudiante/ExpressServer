var DataTypes = require("sequelize").DataTypes;
var _refresh_token = require("./refresh_token");
var _user_encrypt = require("./user_encrypt");
var _user_info = require("./user_info");

function initModels(sequelize) {
  var refresh_token = _refresh_token(sequelize, DataTypes);
  var user_encrypt = _user_encrypt(sequelize, DataTypes);
  var user_info = _user_info(sequelize, DataTypes);


  return {
    refresh_token,
    user_encrypt,
    user_info,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

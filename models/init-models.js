var DataTypes = require("sequelize").DataTypes;
var _user_encrypt = require("./user_encrypt");
var _user_info = require("./user_info");

function initModels(sequelize) {
  var user_encrypt = _user_encrypt(sequelize, DataTypes);
  var user_info = _user_info(sequelize, DataTypes);

  return {
    user_encrypt,
    user_info,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_encrypt', {
    No: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    pw: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_encrypt',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "No" },
        ]
      },
      {
        name: "No",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "No" },
        ]
      },
    ]
  });
};

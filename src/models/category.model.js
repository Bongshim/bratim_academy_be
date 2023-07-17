const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const category = sequelize.define('category', {
    name: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    description: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    icon: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
  });
  sequelizePaginate.paginate(category);

  return category;
};

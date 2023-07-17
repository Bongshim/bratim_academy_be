const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const forum = sequelize.define('forum', {
    title: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
      unique: true,
    },
    description: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
  });

  sequelizePaginate.paginate(forum);
  return forum;
};

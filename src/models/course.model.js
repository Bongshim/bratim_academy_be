const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const course = sequelize.define('course', {
    title: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    description: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    slug: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    image: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
  });
  sequelizePaginate.paginate(course);
  return course;
};

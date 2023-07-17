const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const courseResource = sequelize.define('course_resource', {
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
    resource_type: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    url: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
  });
  sequelizePaginate.paginate(courseResource);
  return courseResource;
};

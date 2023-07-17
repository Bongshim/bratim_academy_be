const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const courseSession = sequelize.define('course_session', {
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
    cost: {
      type: dataType.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: dataType.STRING,
    },
    link: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    enrollment_deadline: {
      type: dataType.DATE,
    },
    start_date: {
      type: dataType.DATE,
    },
    end_date: {
      type: dataType.DATE,
    },
  });

  sequelizePaginate.paginate(courseSession);

  return courseSession;
};

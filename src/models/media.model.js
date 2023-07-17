const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, dataType) => {
  const media = sequelize.define('media', {
    type: {
      type: dataType.STRING,
      allowNull: false,
    },
    url: {
      type: dataType.STRING,
      allowNull: false,
    },
    publicId: {
      type: dataType.STRING,
      allowNull: false,
    },
  });

  sequelizePaginate.paginate(media);

  return media;
};

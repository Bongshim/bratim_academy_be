module.exports = (sequelize, dataType) => {
  const auditTrail = sequelize.define('auditTrail', {
    actor: {
      type: dataType.STRING,
      allowNull: false,
      defaultValue: 'anonymous user',
    },
    action: {
      type: dataType.STRING,
      allowNull: false,
    },
    module: {
      type: dataType.STRING,
      allowNull: false,
    },
    browser: {
      type: dataType.STRING,
      allowNull: false,
    },
    route: {
      type: dataType.STRING,
      allowNull: false,
    },
    ip: {
      type: dataType.STRING,
      allowNull: false,
    },
    status: {
      type: dataType.STRING,
      allowNull: false,
    },
  });

  return auditTrail;
};

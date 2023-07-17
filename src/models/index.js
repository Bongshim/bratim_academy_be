const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');
const logger = require('../config/logger');

const sequelizeInstance = new Sequelize(sequelize.url);
const db = {};

sequelizeInstance
  .authenticate()
  .then(() => logger.info('DB connected'))
  .catch((err) => {
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.user = require('./user.model')(sequelizeInstance, Sequelize);
db.tokens = require('./token.model')(sequelizeInstance, Sequelize);
db.roles = require('./role.model')(sequelizeInstance, Sequelize);
db.permission = require('./permission.model')(sequelizeInstance, Sequelize);
db.variable = require('./variables.model')(sequelizeInstance, Sequelize);
db.message_template = require('./message_template.model')(sequelizeInstance, Sequelize);
db.lecturer = require('./lecturer.model')(sequelizeInstance, Sequelize);
db.course = require('./course.model')(sequelizeInstance, Sequelize);
db.course_session = require('./course_session.model')(sequelizeInstance, Sequelize);
db.course_resource = require('./course_resource.model')(sequelizeInstance, Sequelize);
db.course_subscription = require('./course_subscription.model')(sequelizeInstance, Sequelize);
db.category = require('./category.model')(sequelizeInstance, Sequelize);
db.forum = require('./forum.model')(sequelizeInstance, Sequelize);
db.post = require('./post.model')(sequelizeInstance, Sequelize);
db.comment = require('./comment.model')(sequelizeInstance, Sequelize);
db.blog = require('./blog.model')(sequelizeInstance, Sequelize);
db.media = require('./media.model')(sequelizeInstance, Sequelize);
db.auditTrail = require('./auditTrail.model')(sequelizeInstance, Sequelize);
db.tag = require('./tag.model')(sequelizeInstance, Sequelize);

// relationships for models

//= ==============================
// Define all relationships here below
//= ==============================
// db.User.hasMany(db.Role);
// db.Role.belongsTo(db.User);

// courses to course resource
db.user.hasOne(db.tokens, { foreignKey: 'userId' });
db.tokens.belongsTo(db.user, { foreignKey: 'userId' });

// courses to course resource
db.course_session.hasMany(db.course_resource);
db.course_resource.belongsTo(db.course_session);

// categories to courses
db.category.hasMany(db.course, { as: 'courses' });
db.course.belongsTo(db.category, { as: 'category' });

// category to categrory - parent - nested category
db.category.hasOne(db.category, { foreignKey: 'parentId', as: 'ChildCategories' });
db.category.belongsTo(db.category, { foreignKey: 'parentId', as: 'ParentCategory' });

// user to courses
db.user.belongsToMany(db.course_session, {
  through: db.lecturer,
  as: 'Sessions',
  foreignKey: 'lecturerId',
});
db.course_session.belongsToMany(db.user, {
  through: db.lecturer,
  as: 'Lecturers',
  foreignKey: 'courseSessionId',
});

// user to role
db.user.belongsToMany(db.roles, { through: 'user_role' });
db.roles.belongsToMany(db.user, { through: 'user_role' });

// role to permissions
db.roles.belongsToMany(db.permission, { through: 'role_permisson' });
db.permission.belongsToMany(db.roles, { through: 'role_permisson' });

// course to course session
db.course.hasMany(db.course_session, { foreignKey: 'courseId' });
db.course_session.belongsTo(db.course, { foreignKey: 'courseId' });

// user to course
db.user.hasMany(db.course, { foreignKey: 'createdBy' });
db.course.belongsTo(db.user, { foreignKey: 'createdBy' });

// user to course session
db.user.hasMany(db.course_session, { foreignKey: 'createdBy' });
db.course_session.belongsTo(db.user, { foreignKey: 'createdBy' });

// post to forum
db.forum.hasMany(db.post, { foreignKey: 'forumId' });
db.post.belongsTo(db.forum, { foreignKey: 'forumId' });

// courses to forum
db.user.hasMany(db.post, { foreignKey: 'senderId' });
db.post.belongsTo(db.user, { foreignKey: 'senderId' });

// courses to forum
db.forum.hasOne(db.course, { foreignKey: 'forumId' });
db.course.belongsTo(db.forum, { foreignKey: 'forumId' });

// post to comments
db.post.hasMany(db.comment, { foreignKey: 'postId' });
db.comment.belongsTo(db.post, { foreignKey: 'postId' });

// user to comments
db.user.hasMany(db.comment, { foreignKey: 'senderId' });
db.comment.belongsTo(db.user, { foreignKey: 'senderId' });

// course session to course subscription
db.course_session.hasMany(db.course_subscription, { foreignKey: 'course_session_Id' });
db.course_subscription.belongsTo(db.course_session, { foreignKey: 'course_session_Id' });

// userId to course subscription
db.user.hasMany(db.course_subscription, { foreignKey: 'userId' });
db.course_subscription.belongsTo(db.user, { foreignKey: 'userId' });

// message template to variables
db.message_template.belongsToMany(db.variable, { through: 'message_variable', onDelete: 'cascade' });
db.variable.belongsToMany(db.message_template, { through: 'message_variable' });

// user to blog
db.user.hasMany(db.blog, { foreignKey: 'authorId' });
db.blog.belongsTo(db.user, { foreignKey: 'authorId' });

// Posts to tags
db.tag.belongsToMany(db.post, { through: 'post_tag' });
db.post.belongsToMany(db.tag, { through: 'post_tag' });

module.exports = {
  db,
};

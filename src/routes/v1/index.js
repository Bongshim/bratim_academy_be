const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const messageTemplateRoute = require('./message_template.route');
const docsRoute = require('./docs.route');
const variableRoute = require('./variable.route');
const categoryRoute = require('./category.route');
const uploadRoute = require('./upload.route');
const forumRoute = require('./forum.route');
const courseRoute = require('./course.route');
const courseSessionRoute = require('./course_session.route');
const courseResourceRoute = require('./course_resource.route');
const roleRoute = require('./role.route');
const permissionRoute = require('./permission.route');
const orderRoute = require('./order.route');
const paystackRoute = require('./paystack.route');
const postRoute = require('./post.route');
const commentRoute = require('./comment.route');
const purchaseRoute = require('./purchase.route');
const blogRoute = require('./blog.route');
const dashboardRoute = require('./dashboard.route');
const reportRoute = require('./report.route');
const tagRoute = require('./tag.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/variables',
    route: variableRoute,
  },
  {
    path: '/message-templates',
    route: messageTemplateRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/courses',
    route: courseRoute,
  },
  {
    path: '/forums',
    route: forumRoute,
  },
  {
    path: '/uploads',
    route: uploadRoute,
  },
  {
    path: '/course-sessions',
    route: courseSessionRoute,
  },
  {
    path: '/course-resources',
    route: courseResourceRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/paystack',
    route: paystackRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/purchase',
    route: purchaseRoute,
  },
  {
    path: '/blogs',
    route: blogRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/reports',
    route: reportRoute,
  },
  {
    path: '/tags',
    route: tagRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;

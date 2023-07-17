const logger = require('../config/logger');
const { db } = require('../models');
const { createMessageTemplate } = require('../services/message_template.service');
const { createUser } = require('../services/user.service');

const setAdminPermissions = async () => {
  const adminRole = await db.roles.findOne({ where: { name: 'admin' } });
  const adminPermissions = await db.permission.findAll();
  await adminRole.setPermissions(adminPermissions);
};

const setLecturerPermissions = async () => {
  const lecturerRole = await db.roles.findOne({ where: { name: 'lecturer' } });
  const permissionsValue = [
    'categories.view',
    'categories.manage',
    'courses.view',
    'courses.manage',
    'course_session.view',
    'course_session.manage',
    'course_resource.view',
    'users.view',
    'users.manage',
    'forum.view',
    'forum.manage',
    'posts.view',
    'posts.manage',
    'comments.view',
    'comments.manage',
  ];
  const lecturerPermissions = await db.permission.findAll({ where: { value: permissionsValue } });
  await lecturerRole.setPermissions(lecturerPermissions);
};

const setUserPermissions = async () => {
  const userRole = await db.roles.findOne({ where: { name: 'user' } });
  const permissionsValue = [
    'categories.view',
    'courses.view',
    'users.view',
    'users.manage',
    'course_session.view',
    'course_resource.view',
    'forum.view',
    'posts.view',
    'posts.manage',
    'comments.view',
    'comments.manage',
  ];
  const userPermissions = await db.permission.findAll({ where: { value: permissionsValue } });
  await userRole.setPermissions(userPermissions);
};

const createDummyRoles = async () => {
  // create roles
  const roles = [
    {
      name: 'user',
      description: 'all users',
    },
    {
      name: 'lecturer',
      description: 'all lecturers',
    },
    {
      name: 'admin',
      description: 'system admin with access to all features',
    },
  ];

  //   get existing roles
  const allRoles = await db.roles.findAll();

  //   if role is empty bulk create roles
  if (allRoles.length === 0 || allRoles.length !== roles.length) {
    // filter for roles that do not exist
    const filteredRoles = roles.filter((role) => !allRoles.find((r) => r.dataValues.name === role.name));
    await db.roles.bulkCreate(filteredRoles);
    logger.info('roles created'.rainbow);
  }
};

const createDummyCategories = async () => {
  // create categories
  const categories = [
    {
      name: 'Accounting',
      description: 'Accounting',
      icon: 'fa fa-laptop',
    },
    {
      name: 'Taxation',
      description: 'Taxation',
      icon: 'fa fa-laptop',
    },
  ];

  //   get existing categories
  const allCategories = await db.category.findAll();

  //   if category is empty bulk create categories
  if (allCategories.length === 0) {
    await db.category.bulkCreate(categories);
    logger.info('categories created'.rainbow);
  }
};

const createDummyVariables = async () => {
  // create variables
  const variables = [
    {
      name: 'userName',
    },
    {
      name: 'lastName',
    },
    {
      name: 'firstName',
    },
    {
      name: 'token',
    },
    {
      name: 'middleName',
    },
  ];

  //   get existing variables
  const allVariables = await db.variable.findAll();

  //   if variables is empty bulk create variables
  if (allVariables.length === 0 || allVariables.length !== variables.length) {
    // filter for variables that do not exist
    const filteredVariables = variables.filter((variable) => !allVariables.find((v) => v.dataValues.name === variable.name));
    await db.variable.bulkCreate(filteredVariables);
    logger.info('variables created'.rainbow);
  }
};

const createDummyMessageTemplates = async () => {
  const MessageTemplates = [
    {
      messageTemplate: {
        title: 'Welcome_Email',
        description: 'Welcome email to new users',
        emailSubject: 'Welcome to the platform',
        emailBody: 'Hello {{firstName}}, welcome to the platform',
        smsSubject: 'Welcome to the platform',
        smsBody: 'Hello {{firstName}}, welcome to the platform',
      },
      variables: [
        {
          name: 'firstName',
        },
      ],
    },
    {
      messageTemplate: {
        title: 'Reset_Password',
        description: 'Reset password message',
        emailSubject: 'Reset Password',
        emailBody:
          'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/reset-password?token={{token}} If you did not request any password resets, then ignore this email.',
        smsSubject: 'Reset Password',
        smsBody:
          'Dear {{firstName}}, To reset your password, click on this link: http://localhost:3000/reset-password?token={{token}} If you did not request any password resets, then ignore this email.',
      },
      variables: [
        {
          name: 'firstName',
        },
        {
          name: 'token',
        },
      ],
    },
  ];

  //   get existing message templates
  const allMessageTemplates = await db.message_template.findAll();

  //   if message templates is empty bulk create message templates
  if (allMessageTemplates.length === 0 || allMessageTemplates.length !== MessageTemplates.length) {
    // filter for message templates that do not exist
    const filteredMessageTemplates = MessageTemplates.filter(
      (messageTemplate) => !allMessageTemplates.find((m) => m.dataValues.title === messageTemplate.messageTemplate.title)
    );
    filteredMessageTemplates.forEach(async (messageTemplate) => {
      await createMessageTemplate(messageTemplate);
    });
    logger.info('message templates created'.rainbow);
  }
};

const createDummyForums = async () => {
  const forums = [
    {
      title: 'JavaScript - Understanding the Weird Parts',
      description:
        'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
    },
    {
      title: 'Learn and Understand NodeJS',
      description: 'Learn Node.JS by building real-world applications with Node, Express, MongoDB, Jest, and more!',
    },
  ];

  //   get existing forums
  const allForums = await db.forum.findAll();

  //   if message templates is empty bulk create message templates
  if (allForums.length === 0 || allForums.length !== forums.length) {
    // filter for message templates that do not exist
    const filteredForums = forums.filter((forum) => !allForums.find((f) => f.dataValues.title === forum.title));
    filteredForums.forEach(async (forum) => {
      await db.forum.create(forum);
    });
    logger.info('forum created'.rainbow);
  }
};

const createDummyUsers = async () => {
  const users = [
    {
      firstName: 'lecturer',
      lastName: 'lecture',
      phoneNumber: '12345678',
      email: 'lecturer@example.com',
      password: 'password1',
      role: 'lecturer',
    },
    {
      firstName: 'admin',
      lastName: 'admin',
      phoneNumber: '12345678',
      email: 'admin@example.com',
      password: 'password1',
      role: 'admin',
    },
    {
      firstName: 'user',
      lastName: 'user',
      phoneNumber: '12345678',
      email: 'user@example.com',
      password: 'password1',
      role: 'user',
    },
  ];

  //   get existing users
  const allUsers = await db.user.findAll();

  //   if user is empty bulk create users
  if (allUsers.length === 0 || allUsers.length !== users.length) {
    // filter for users that do not exist
    const filteredUsers = users.filter((user) => !allUsers.find((l) => l.dataValues.email === user.email));
    filteredUsers.forEach(async (user) => {
      await createUser(user);
    });
    logger.info('users created'.rainbow);
  }
};

const createPermissions = async () => {
  const permissions = [
    {
      name: 'View Users',
      value: 'users.view',
      groupName: 'User Permissions',
      description: 'Permission to view other users account details',
    },
    {
      name: 'Manage Users',
      value: 'users.manage',
      groupName: 'User Permissions',
      description: 'Permission to create, delete and modify other users account details',
    },
    {
      name: 'View Permissions',
      value: 'permissions.view',
      groupName: 'Permission Permissions',
      description: 'Permission to view permissions',
    },
    {
      name: 'Manage Permissions',
      value: 'permissions.manage',
      groupName: 'Permission Permissions',
      description: 'Permission to create, delete and modify permissions',
    },
    {
      name: 'View Roles',
      value: 'roles.view',
      groupName: 'Role Permissions',
      description: 'Permission to view roles',
    },
    {
      name: 'Manage Roles',
      value: 'roles.manage',
      groupName: 'Role Permissions',
      description: 'Permission to create, delete and modify roles',
    },
    {
      name: 'View Categories',
      value: 'categories.view',
      groupName: 'Category Permissions',
      description: 'Permission to view categories',
    },
    {
      name: 'Manage Categories',
      value: 'categories.manage',
      groupName: 'Category Permissions',
      description: 'Permission to create, delete and modify categories',
    },
    {
      name: 'View Courses',
      value: 'courses.view',
      groupName: 'Course Permissions',
      description: 'Permission to view courses',
    },
    {
      name: 'Manage Courses',
      value: 'courses.manage',
      groupName: 'Course Permissions',
      description: 'Permission to create, delete and modify courses',
    },
    {
      name: 'View Message Templates',
      value: 'message_templates.view',
      groupName: 'Message Template Permissions',
      description: 'Permission to view message templates',
    },
    {
      name: 'Manage Message Templates',
      value: 'message_templates.manage',
      groupName: 'Message Template Permissions',
      description: 'Permission to create, delete and modify message templates',
    },
    {
      name: 'View Variables',
      value: 'variables.view',
      groupName: 'Variable Permissions',
      description: 'Permission to view variables',
    },
    {
      name: 'Manage Variables',
      value: 'variables.manage',
      groupName: 'Variable Permissions',
      description: 'Permission to create, delete and modify variables',
    },
    {
      name: 'View Course Session',
      value: 'course_session.view',
      groupName: 'Course Session Permissions',
      description: 'Permission to view course session',
    },
    {
      name: 'Manage Course Session',
      value: 'course_session.manage',
      groupName: 'Course Session Permissions',
      description: 'Permission to create, delete and modify course session',
    },
    {
      name: 'View Comments',
      value: 'comments.view',
      groupName: 'Comment Permissions',
      description: 'Permission to view comments',
    },
    {
      name: 'Manage Comments',
      value: 'comments.manage',
      groupName: 'Comment Permissions',
      description: 'Permission to create, delete and modify comments',
    },
    {
      name: 'Moderate Comments',
      value: 'comments.moderate',
      groupName: 'Comment Permissions',
      description: 'Permission to moderate comments',
    },
    {
      name: 'View Posts',
      value: 'posts.view',
      groupName: 'Post Permissions',
      description: 'Permission to view posts',
    },
    {
      name: 'Manage Posts',
      value: 'posts.manage',
      groupName: 'Post Permissions',
      description: 'Permission to create, delete and modify posts',
    },
    {
      name: 'Moderate Posts',
      value: 'posts.moderate',
      groupName: 'Post Permissions',
      description: 'Permission to moderate posts',
    },
    {
      name: 'View Forum',
      value: 'forum.view',
      groupName: 'Forum Permissions',
      description: 'Permission to view forum',
    },
    {
      name: 'Manage Forum',
      value: 'forum.manage',
      groupName: 'Forum Permissions',
      description: 'Permission to create, delete and modify forum',
    },
    {
      name: 'View Course Resource',
      value: 'course_resource.view',
      groupName: 'Course Resource Permissions',
      description: 'Permission to view course resource',
    },
    {
      name: 'Manage Course Resource',
      value: 'course_resource.manage',
      groupName: 'Course Resource Permissions',
      description: 'Permission to create, delete and modify course resource',
    },
    {
      name: 'Manage Blog',
      value: 'blog.manage',
      groupName: 'Blog Permissions',
      description: 'Permission to create, delete and modify blog',
    },
  ];

  //   get existing permissions
  try {
    const allPermissions = await db.permission.findAll();

    //   if permission is empty bulk create permissions
    if (allPermissions.length === 0 || allPermissions.length !== permissions.length) {
      // filter for permissions that do not exist
      const filteredPermissions = permissions.filter(
        (permission) => !allPermissions.find((l) => l.dataValues.value === permission.value)
      );
      filteredPermissions.forEach(async (permission) => {
        // TODO: add permission service
        await db.permission.create(permission);
      });
      logger.info('permissions created'.rainbow);
    }
  } catch (e) {
    logger.error(e);
  }

  // set permissions for roles
  await setAdminPermissions();
  await setUserPermissions();
  await setLecturerPermissions();
};

const initializeDatabase = async () => {
  await createDummyRoles();
  await createDummyCategories();
  await createDummyVariables();
  await createDummyMessageTemplates();
  await createDummyUsers();
  await createPermissions();
  await createDummyForums();
};

module.exports = {
  initializeDatabase,
};

const allRoles = {
  user: ['getResearchData', 'getCategories'],
  admin: [
    'getUsers',
    'manageUsers',
    'getMessageTemplates',
    'manageMessageTemplates',
    'getCategories',
    'manageCategories',
    'getResearchData',
    'manageResearchData',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

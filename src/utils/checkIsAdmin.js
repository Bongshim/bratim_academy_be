function checkAdmin(req) {
  let isAdmin = false;
  if (req.user) {
    isAdmin = req.user.dataValues.roles.includes('admin');
  }
  return isAdmin;
}

function checkAdminOrLecturer(req) {
  let isAdmin = false;
  if (req.user) {
    isAdmin = req.user.dataValues.roles.includes('admin');
  }
  let isLecturer = false;
  if (req.user) {
    isLecturer = req.user.dataValues.roles.includes('lecturer');
  }
  return { isAdmin, isLecturer };
}

module.exports = { checkAdmin, checkAdminOrLecturer };

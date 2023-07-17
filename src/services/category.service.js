const { Op } = require('sequelize');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * Get all categories
 * @param {Object} filter - Sequelize filter
 * @returns {Promise<Category[]>}
 */
const getAllCategories = async () => {
  return db.category.findAll();
};

/**
 * Get all course categories
 * @param {Object} filter - Sequelize filter
 * @param {Object} filter.name
 * @param {Object} current - Sequelize pagination
 * @param {Object} current.page - current page
 * @param {Object} current.limit - current limit
 * @param {Object} current.sortby - sortby
 * @returns {Promise<Categories[]>}
 */
const getAllCourseCategories = async (filter, current) => {
  const options = {
    page: current.page, // Default 1
    paginate: current.limit, // Default 25
    where: {
      name: {
        [Op.like]: `%${filter.name || ''}%`,
      },
      parentId: 1,
    },
    order: [['name', current.sortby]],
  };
  const { docs, pages, total } = await db.category.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return db.category.findByPk(id, {
    include: [
      {
        model: db.category,
        as: 'ParentCategory',
        attributes: ['id', 'name'],
      },
    ],
  });
};

/**
 * Is dubplicate category
 * @param {String} name
 * @param {ObjectId} parentId
 * @returns {Promise<Boolean>}
 */
const isDuplicateCategory = async (name, parentId) => {
  const category = await db.category.findOne({
    where: {
      name,
      parentId,
    },
  });

  return !!category;
};

/**
 * create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  // extact the category and parent category from the object
  const { parentId, ...category } = categoryBody;

  // check if the parent category exists
  const parentCategoryExist = await getCategoryById(parentId);
  if (!parentCategoryExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Parent category does not exist');
  }

  // check if category name is taken
  if (category.name && (await isDuplicateCategory(category.name, parentId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category name must be unique');
  }

  // create the category
  const createdCategory = await db.category.create({ parentId, ...category });
  return getCategoryById(createdCategory.dataValues.id);
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const { parentId, ...category } = updateBody;

  const categoryExist = await getCategoryById(categoryId);
  if (!categoryExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // check if category name is taken
  if (category.name && (await isDuplicateCategory(category.name, categoryExist.dataValues.parentId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category name already taken');
  }

  // check if the parent category exists
  if (parentId) {
    const parentCategoryExist = await getCategoryById(parentId);
    if (!parentCategoryExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Parent category does not exist');
    }
  }

  // update category
  Object.assign(categoryExist, category);
  await categoryExist.save();

  return getCategoryById(categoryExist.dataValues.id);
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const categoryExist = await getCategoryById(categoryId);
  if (!categoryExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // check if there are any courses under this category
  const courseExist = await db.course.findOne({
    where: {
      categoryId,
    },
  });

  if (courseExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category cannot be deleted because it has courses');
  }
  await categoryExist.destroy();
  return categoryExist;
};

/**
 * Get course session by category
 * @param {ObjectId} categoryId
 * @param {Object} current - Sequelize pagination
 * @param {Object} current.page - Sequelize pagination page
 * @param {Object} current.limit - Sequelize pagination limit
 * @returns {Promise<CourseSession[]>}
 */
const getCourseSessionByCategory = async (categoryId, current) => {
  const categoryExist = await getCategoryById(categoryId);
  if (!categoryExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const options = {
    page: current.page, // Default 1
    paginate: current.limit, // Default 25
    where: {
      enrollment_deadline: {
        [Op.gte]: new Date(),
      },
    },
    include: [
      {
        model: db.course,
        as: 'course',
        attributes: ['title'],
        required: true,
        include: [
          {
            model: db.category,
            as: 'category',
            attributes: ['id', 'name'],
            where: {
              id: categoryId,
            },
            required: true,
          },
        ],
      },
    ],
  };

  const { docs, pages, total } = await db.course_session.paginate(options);

  return { docs, limit: options.paginate, totalPages: pages, totalResults: total };

  // return db.course_session.findAll({
  //   include: [
  //     {
  //       model: db.course,
  //       as: 'course',
  //       attributes: [],
  //       include: [
  //         {
  //           model: db.category,
  //           as: 'category',
  //           where: {
  //             id: categoryId,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       model: db.user,
  //       as: 'Lecturers',
  //       attributes: ['id', 'firstName', 'lastName', 'profileImage'],
  //       through: {
  //         attributes: [],
  //       },
  //     },
  //   ],
  // });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCourseCategories,
  getCourseSessionByCategory,
};

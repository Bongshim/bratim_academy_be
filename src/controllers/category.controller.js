const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(httpStatus.OK).send(categories);
});

const getAllCourseCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['page', 'limit', 'sortby']);
  const categories = await categoryService.getAllCourseCategories(filter, options);
  res.status(httpStatus.OK).send(categories);
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  res.status(httpStatus.OK).send(category);
});

const updateCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.status(httpStatus.OK).send(category);
});

const deleteCategoryById = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCourseSessionByCategory = catchAsync(async (req, res) => {
  const options = pick(req.query, ['page', 'limit']);
  const category = await categoryService.getCourseSessionByCategory(req.params.categoryId, options);
  res.status(httpStatus.OK).send(category);
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCourseCategories,
  getCourseSessionByCategory,
};

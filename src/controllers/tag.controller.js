const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tagService } = require('../services');
const pick = require('../utils/pick');

const createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.body);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Tag created successfully',
    data: tag,
  });
});

const getAllTags = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const tags = await tagService.getAllTags(filter);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Tags retrieved successfully',
    data: tags,
  });
});

const deleteTagById = catchAsync(async (req, res) => {
  await tagService.deleteTagById(req.params.tagId);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Tag deleted successfully',
  });
});

module.exports = {
  createTag,
  getAllTags,
  deleteTagById,
};

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { uploadService } = require('../services');

const uploadFile = catchAsync(async (req, res) => {
  const url = await uploadService.uploadFile(req.file);
  res.status(httpStatus.CREATED).send(url);
});

module.exports = {
  uploadFile,
};

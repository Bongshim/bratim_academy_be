const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const handleOrder = catchAsync(async (req, res) => {
  const order = await orderService.handleOrder(req.body, req.user);
  res.status(httpStatus.CREATED).send(order);
});

module.exports = {
  handleOrder,
};

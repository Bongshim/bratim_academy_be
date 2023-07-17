const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paystackService, orderService } = require('../services');

const paystackCallback = catchAsync(async (req, res) => {
  const { reference } = req.query;
  const data = await paystackService.verifyPayment(reference);
  await orderService.updateOrder(data);
  res.status(httpStatus.OK).send({ message: 'Payment successful' });
});

module.exports = {
  paystackCallback,
};

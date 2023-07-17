const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { secret } = require('../config/config').paystack;
const logger = require('../config/logger');

/**
 * Api call to paystack
 * @type {AxiosInstance}
 */
const apiCall = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: { Authorization: `Bearer ${secret}` },
});

/**
 * Initialize paystack transaction
 * @param {Object} amount
 * @param {Object} email
 * @returns {Promise<Paystack>}
 */
const initializePaystackTransaction = async (amount, email) => {
  try {
    const { data } = await apiCall.post('/transaction/initialize', { amount, email });
    return data;
  } catch (error) {
    logger.info(error);
  }
};

/**
 * Verify payment
 * @param {string} reference
 * @returns {Promise<Order>}
 */
const verifyPayment = async (reference) => {
  try {
    const { data } = await apiCall.get(`transaction/verify/${reference}`);
    if (!data.status) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment failed');
    }
    return data;
  } catch (error) {
    logger.info(error);
  }
};

module.exports = {
  initializePaystackTransaction,
  verifyPayment,
};

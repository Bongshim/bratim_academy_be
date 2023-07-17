const express = require('express');
const { paystackController } = require('../../controllers');

const router = express.Router();

router.route('/cb').get(paystackController.paystackCallback);

module.exports = router;

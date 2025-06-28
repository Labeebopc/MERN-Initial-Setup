const { query } = require('express-validator');
const OrderDetail = require('../models/orderDetails');
const AssetDetail = require('../models/assetDetails');

module.exports = [

  query('orderRefNo').optional().custom(async (val) => {

    const exists = await OrderDetail.findOne({ orderRefNo: val });

    if (!exists) throw new Error('Invalid Order Ref No');

    return true;
  }),

  query('securityName').optional().custom(async (val) => {

    const exists = await AssetDetail.findOne({ securityName: val });

    if (!exists) throw new Error('Invalid Security Name');
    return true;

  }),

  query('transactionType').optional().isIn(['BUY', 'SELL']).withMessage('Invalid Transaction Type'),

  query('fromDate').optional().isISO8601().toDate(),

  query('toDate').optional().isISO8601().toDate().custom((val, { req }) => {

    if (req.query.fromDate && new Date(req.query.fromDate) > new Date(val)) {
      throw new Error('From Date should be before To Date');
    }

    return true;
  })
];

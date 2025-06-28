const { validationResult } = require('express-validator');
const AuditAction = require('../models/auditActions');
const portfolioService = require('../services/portfolioService');

exports.getSummary = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const filter = {
    orderRefNo: req.query.orderRefNo,
    securityName: req.query.securityName,
    transactionType: req.query.transactionType,
    fromDate: req.query.fromDate,
    toDate: req.query.toDate
  };

  await AuditAction.create({ filter });

  const data = await portfolioService.getPortfolioSummary(filter);

  res.json({ status: true, data });
};

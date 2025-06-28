const OrderDetail = require('../models/orderDetails');
const AssetDetail = require('../models/assetDetails');

exports.getPortfolioSummary = async (filter, startingCash = 10000) => {
  const match = {};

  if (filter.orderRefNo) match.orderRefNo = filter.orderRefNo;
  if (filter.securityName) match.securityName = filter.securityName;
  if (filter.transactionType) match.transactionType = filter.transactionType;
  if (filter.fromDate || filter.toDate) {

    match.orderDate = {};

    if (filter.fromDate) match.orderDate.$gte = new Date(filter.fromDate);
    if (filter.toDate) match.orderDate.$lte = new Date(filter.toDate);
  }

  const orders = await OrderDetail.find(match).sort({ orderDate: 1 }).lean();

  let balance = startingCash;

  const transactions = orders.map((o) => {
    const cashChange = o.transactionType === 'BUY' ? -o.amount : o.amount;
    balance += cashChange;
    
    return {
      orderDate: o.orderDate,
      orderRefNo: o.orderRefNo,
      fundName: o.fundName,
      transactionType: o.transactionType,
      credit: cashChange > 0 ? cashChange : 0,
      debit: cashChange < 0 ? -cashChange : 0,
      runningBalance: balance
    };
  });

  const holdings = await OrderDetail.aggregate([
    { $match: match },
    {
      $group: {
        _id: { security: '$securityName', type: '$transactionType' },
        totalQty: { $sum: '$quantity' }
      }
    },
    {
      $group: {
        _id: '$_id.security',
        buyQty: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'BUY'] }, '$totalQty', 0]
          }
        },
        sellQty: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'SELL'] }, '$totalQty', 0]
          }
        }
      }
    },
    {
      $project: {
        securityName: '$_id',
        quantity: { $subtract: ['$buyQty', '$sellQty'] },
        _id: 0
      }
    }
  ]);

  const allocation = await OrderDetail.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'assetdetails',
        localField: 'securityName',
        foreignField: 'securityName',
        as: 'assetInfo'
      }
    },
    { $unwind: '$assetInfo' },
    {
      $group: {
        _id: '$assetInfo.assetClass',
        marketValue: {
          $sum: {
            $cond: [
              { $eq: ['$transactionType', 'BUY'] },
              { $multiply: ['$quantity', '$price'] },
              { $multiply: [-1, '$quantity', '$price'] }
            ]
          }
        }
      }
    },
    { $project: { assetClass: '$_id', marketValue: 1, _id: 0 } }
  ]);

  const performance = await OrderDetail.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          y: { $year: '$orderDate' },
          m: { $month: '$orderDate' }
        },
        netCashFlow: {
          $sum: {
            $cond: [
              { $eq: ['$transactionType', 'BUY'] },
              { $multiply: [-1, '$amount'] },
              '$amount'
            ]
          }
        }
      }
    },
    {
      $project: {
        month: {
          $concat: [
            { $toString: '$_id.y' }, '-',
            { $toString: '$_id.m' }
          ]
        },
        netCashFlow: 1,
        _id: 0
      }
    },
    { $sort: { month: 1 } }
  ]);

  return { transactions, holdings, assetAllocation: allocation, performance };
};

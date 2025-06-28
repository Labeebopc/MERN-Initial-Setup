const mongoose = require('mongoose');

const OrderDetail = mongoose.model('OrderDetail', new mongoose.Schema({
  orderDate: Date,
  orderRefNo: String,
  securityName: String,
  fundName: String,
  transactionType: { type: String, enum: ['BUY', 'SELL'] },
  quantity: Number,
  price: Number,
  amount: Number
}));

const AssetDetail = mongoose.model('AssetDetail', new mongoose.Schema({
  securityName: String,
  assetClass: String
}));

const AuditAction = mongoose.model('AuditAction', new mongoose.Schema({
  ts: { type: Date, default: Date.now },
  userId: mongoose.Schema.Types.ObjectId,
  filter: Object
}));

mongoose.connect('mongodb://localhost:27017/portfolio_db')
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Clear data (instead of dropDatabase)
    await OrderDetail.deleteMany({});
    await AssetDetail.deleteMany({});
    await AuditAction.deleteMany({});

    await AssetDetail.insertMany([
      { securityName: 'AAPL', assetClass: 'Equity' },
      { securityName: 'TSLA', assetClass: 'Equity' },
      { securityName: 'US10Y', assetClass: 'Bond' }
    ]);

    await OrderDetail.insertMany([
      {
        orderDate: new Date('2025-01-01'),
        orderRefNo: 'ORD001',
        securityName: 'AAPL',
        fundName: 'Tech Growth Fund',
        transactionType: 'BUY',
        quantity: 10,
        price: 150,
        amount: 1500
      },
      {
        orderDate: new Date('2025-02-01'),
        orderRefNo: 'ORD002',
        securityName: 'TSLA',
        fundName: 'Tech Growth Fund',
        transactionType: 'BUY',
        quantity: 5,
        price: 800,
        amount: 4000
      },
      {
        orderDate: new Date('2025-03-01'),
        orderRefNo: 'ORD003',
        securityName: 'AAPL',
        fundName: 'Tech Growth Fund',
        transactionType: 'SELL',
        quantity: 5,
        price: 170,
        amount: 850
      },
      {
        orderDate: new Date('2025-04-01'),
        orderRefNo: 'ORD004',
        securityName: 'US10Y',
        fundName: 'Bond Income Fund',
        transactionType: 'BUY',
        quantity: 20,
        price: 100,
        amount: 2000
      }
    ]);

    await AuditAction.create({
      userId: null,
      filter: {
        orderRefNo: 'ORD001',
        fromDate: '2025-01-01',
        toDate: '2025-06-01'
      }
    });

    console.log('✅ Mock data inserted');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

const mongoose = require('mongoose');

const assetDetailSchema = new mongoose.Schema({

  securityName: { 
    type: String, required: true, unique: true 
},

  assetClass: { 
    type: String, required: true 
}
});

module.exports = mongoose.model('AssetDetail', assetDetailSchema);

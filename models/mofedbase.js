var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model
               
var Mofedbase = new Schema({
    sid: {type: String, index: true},
    name: {type: String, index: true},
    degree: String,
    lawnum: String,
    begfinance: {type: String},
    endfinance:{type: String},
    socialstatus : {type: String}
    country: String,
    stipen: String,
    begmandate: String,
    endmandate: String,
    months: String,
    total: String,
    currency: String,
    totalinlyd: String,
});
Mofedbase.plugin(timestamps);
module.exports = mongoose.model('Mofedbase', Mofedbase);
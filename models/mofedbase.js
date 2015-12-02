var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model
               
var Mofedbase = new Schema({
    sid: Number,
    name: {type: String, index: true},
    degree: String,
    lawnum: {type: String, index: true},
    begfinance: {type: String},
    endfinance:{type: String},
    socialstatus : {type: String},
    country: String,
    stipen: Number,
    begmandate: String,
    endmandate: String,
    months: Number,
    total: Number,
    currency: String,
    totalinlyd: Number,
});
Mofedbase.index({ name: 'text'});
module.exports = mongoose.model('Mofedbase', Mofedbase);
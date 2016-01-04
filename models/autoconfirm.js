var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// set up a mongoose model

var Autoconfirm = new Schema({
    user: {type: Schema.Types.ObjectId , ref: 'User',index: true, unique: true, required: true },
    confirmed: { type: Number, min: 1, max: 10, default:1 },
});
Autoconfirm.plugin(timestamps);
Autoconfirm.plugin(uniqueValidator);

module.exports = mongoose.model('Autoconfirm', Autoconfirm);
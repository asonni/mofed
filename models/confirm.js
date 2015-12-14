var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// set up a mongoose model

var Confirm = new Schema({
    user: {type: Schema.Types.ObjectId , ref: 'User',index: true, unique: true, required: true },
    mofednid: {type: Schema.Types.ObjectId , ref: 'Mofednid'},
    mofedbase: {type: Schema.Types.ObjectId , ref: 'Mofedbase'},
    verified: { type: Number, min: 1, max: 10, default:1 },
    admin: {type: Schema.Types.ObjectId , ref: 'User'}
});
Confirm.plugin(timestamps);
Confirm.plugin(uniqueValidator);

module.exports = mongoose.model('Confirm', Confirm);
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model

var False = new Schema({
    name: {type: String, index: true, default: "Unknown False"},
    email: {type: String, unique : true, required : true},
    lawnum: {type: String, index: true},
    country: {type: String},
    nid: {type: String, index: true},
    err: String,
    regnum: {type: String, index: true},
    mofedbase: {type: Schema.Types.ObjectId , ref: 'Mofedbase'},
    admin: {type: Schema.Types.ObjectId , ref: 'User'}

});
False.plugin(timestamps);

module.exports = mongoose.model('False', False);
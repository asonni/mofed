var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model

var User = new Schema({
    name: {type: String, index: true, default: "Unknown user"},
  	password: {type: String, required: true},
  	salt: String,
  	email: {type: String, unique : true, required : true},
    phone: {type: String, default:"NULL"},
    lawnum: {type: String, index: true},
    country: {type: String},
    nid: {type: String, index: true},
    regnum: {type: String, index: true},
  	status: Boolean,
  	activated : {type: Boolean, default:false},
    admin : {type: Boolean, default:false},
  	verified: { type: Number, min: 1, max: 10, default:1 },
  	studentId: { type : Date, default: Date.now },
    job : {type : String},
    area : {type: String},
    salary : {type : String}
});
User.plugin(timestamps);
User.index({ name: 'text'});
module.exports = mongoose.model('User', User);
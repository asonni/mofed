var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model

var User = new Schema({
    name: {type: String, index: true},
  	password: String, 
  	salt: String,
  	email: String,
  	status: Boolean,
  	activated : {type: Boolean, default:false},
  	verified: { type: Number, min: 1, max: 10 },
  	studentId: { type : Date, default: Date.now }
});
User.plugin(timestamps);

module.exports = mongoose.model('User', User));
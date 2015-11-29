var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model

var User = new Schema({
    name: {type: String, index: true},
  	password: {type: String, required: true},
  	salt: String,
  	email: {type: String, unique : true, required : true},
  	status: Boolean,
  	activated : {type: Boolean, default:false},
    admin : {type: Boolean, default:false},
  	verified: { type: Number, min: 1, max: 10, default:1 },

  	studentId: { type : Date, default: Date.now }
});
User.plugin(timestamps);

module.exports = mongoose.model('User', User);
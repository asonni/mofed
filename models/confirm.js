var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model

var Confirm = new Schema({
    user: {type: Schema.Types.ObjectId , ref: 'User'},
    mofednid: {type: Schema.Types.ObjectId , ref: 'Mofednid'},
    mofedbase: {type: Schema.Types.ObjectId , ref: 'Mofedbase'}
});
Confirm.plugin(timestamps);

module.exports = mongoose.model('Confirm', Confirm);
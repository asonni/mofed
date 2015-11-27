var Mofednid = require("../models/mofednid");

module.exports = {
  /* here we add a new user to the system */
  getPerson: function (nid,regnum, cb) {
    Mofednid.findOne({nid : nid, regnum: regnum}, function(err, person){
      if (!err) {
        cb(person);
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    });
  }
};
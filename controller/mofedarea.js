var Mofedarea = require("../models/mofedarea");
module.exports = {
  getJobInfo : function (nid, cb){
    Mofedarea.findOne({nid : nid}, function(err, result){
      if (!err) {
        cb(result);
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    });
  }
};
var Autoconfirm = require("../models/autoconfirm"),
    Confirm = require("../models/confirm"),
    User = require("../models/user");
    mailer = require('./mailer');

module.exports = {
  check : function (){
    var minutes = 0.25, the_interval = minutes * 60 * 1000, idLst= [], emailLst=[], userId='', userEmail='';
    setInterval(function() {
      Autoconfirm.findOne({confirmed : 1},'user ')
        .populate('user', 'email ')
        .exec(function(err, autoconfirm){
          if(!err  && autoconfirm != null) {
            userId = autoconfirm.user._id;
            userEmail = autoconfirm.user.email;
            //userEmail = 'ahmed.elfituri@gmail.com';
            User.findOne({_id : userId}, function(err, user){
              if(!err && user != null){
                user.verified = 3;
                user.save(function(err,result){
                  if (!err) {
                    Confirm.findOne({user : userId}, function(err, confirm){
                      if(!err && confirm != null){
                        confirm.verified=2;
                        confirm.save(function(err,result){
                          if (!err) {
                            doConfirm(autoconfirm,userEmail);
                          }
                        });
                      } else {
                        doConfirm(autoconfirm,'ahmed.fituri@gmail.com');
                      }
                    });
                  } else {
                  }
                })
              } else {
                doConfirm(autoconfirm,'ahmed.fituri@gmail.com');
              }
            });
          } else {
            //do somthing
          }
        });
      // do your stuff here
    }, the_interval);
  },
};
function doConfirm(autoconfirm,email) {
  autoconfirm.confirmed =2;
  autoconfirm.save(function(err,result){
    if (!err) {
      var obj = {
        template : "verified",
        subject : "Mofed app Verification",
        locals : {
          email : email,
          host: config.host,
          user : {
            email : email,
          }
        }
      }
      mailer.send(obj); // 
    }
  })
}
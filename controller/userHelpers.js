module.exports = {
  /* here we check if the user have root access */
  isLogin : function (req,res,next) {
    if (req.isAuthenticated() && !req.user.admin) {
    return next();
    }
    res.redirect('/');
  },
  isAdmin : function(req,res,next) {
    if(req.isAuthenticated() && req.user.admin) {
      return next();
    }
    res.redirect('/')
  },
  getFields : function() {
    var fields = ['user.name','user.email','user.nid','user.country' ,'mofedbase.name','mofedbase.lawnum','mofedbase.country', 'mofedbase.sid','admin.name',];
    var fieldNames = ['اسم الموفد', 'بريد الموفد', 'الرقم الوطني للموفد','الدولة المدخلة من الموفد','اسم الموفد من ادارة البعثات','رقم القرار','الدولة المدخلة من البعثات', 'الرقم الآلي من البعثات', 'اسم المسؤول عن التطابق'];
    return ({fields: fields, fieldNames: fieldNames});
  }
};
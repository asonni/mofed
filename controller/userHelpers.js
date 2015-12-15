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
    var fields = ['user.name','user.email','user.nid','user.regnum','user.country' ,'mofedbase.name','mofedbase.lawnum','mofedbase.country', 'mofedbase.sid','admin.name',];
    var fieldNames = ['اسم الموفد', 'بريد الموفد', 'الرقم الوطني للموفد', 'رقم القيد للموفد', 'الدولة المدخلة من الموفد','اسم الموفد من ادارة البعثات','رقم القرار','الدولة المدخلة من البعثات', 'الرقم الآلي من البعثات', 'اسم المسؤول عن التطابق'];
    return ({fields: fields, fieldNames: fieldNames});
  },

  getEmailBody :  function(type) {
    var body = "لقد تم الغاء التأكيد على بياناتك لسبب : خطأ ";
    switch(type) {
      case 1 :
        body += " في رقم القيد المدخلة من طرفك الرجاء التحقق واعادة "+
                "تعبئة البيانات من جديد";
        break;
      case 2 :
        body += " في الرقم الوطني المدخلة من طرفك الرجاء التحقق واعادة "+
                "تعبئة البيانات من جديد";
        break;
      case 3 :
        body += " في الاسم المدخلة من طرفك الرجاء التحقق واعادة "+
                "تعبئة البيانات من جديد";
        break;
      case 4 :
        body += " في الساحة المدخلة من طرفك الرجاء التحقق واعادة "+
                "تعبئة البيانات من جديد";
        break;
    }
    return body;
    
  }
};
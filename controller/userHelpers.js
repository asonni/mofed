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
  }
};
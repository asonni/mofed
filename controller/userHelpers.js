module.exports = {
  /* here we check if the user have root access */
  isLogin : function (req,res,next) {
    if (req.isAuthenticated()) {
    return next();
    }
    res.redirect('/');
  }
};
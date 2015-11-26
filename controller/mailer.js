var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '../views/', 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer')
  , smtpTransport = require('nodemailer-smtp-transport')
  , config = require('../config'); // get our config file

module.exports = {

  send : function (obj){
    emailTemplates(templatesDir, function(err, template) {
      if (err) {
        console.log(err);
      } else {

        // Prepare nodemailer transport object
        var transporter = nodemailer.createTransport(smtpTransport({
          host: 'naga.ly',
          port: 25,
          auth: {
            user: "mofed@naga.ly",
            pass: config.epassword
          },
          tls: {
            rejectUnauthorized: false
          }
        }));

        // Send a single email
        template(obj.template, obj.locals, function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
            transporter.sendMail({
              from: 'Mofed <mofed@naga.ly',
              to: obj.locals.email,
              subject: obj.subject,
              html: html,
              generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
                return false;
              } else {
                console.log(responseStatus.message);
                return true;
              }
            });
          }
        });
      }
    });
  }
}

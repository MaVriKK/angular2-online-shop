var nodemailer = require('nodemailer');
var promise = require('promise');
var config = require('./app.node.config');

//juanswood23@gmail.com
//gr@p3fru1t

var mailer = {
    sendEmail: function(from, to, cc, subject, text, html){
        var promise = new Promise(function(resolve, reject){
             // create reusable transporter object using the default SMTP transport 
            var transporter = nodemailer.createTransport(config.email.smtps_transport);

            var mailOptions = {
                from: from,
                to: to,
                cc: cc,
                subject: subject,
                text: text,
                html: html
            }

            // send mail with defined transport object 
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        })

        return promise;  
    }
}

module.exports = mailer;

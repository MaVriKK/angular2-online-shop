var http = require('http'),
    paypal = require('paypal-rest-sdk'),
    uuid = require('node-uuid'),
    bodyParser = require('body-parser'),
    express = require('express'),
    session = require('express-session'),
    r = require('rethinkdbdash')(),
    app = require('express')(),
    path = require('path'),
    fs = require('fs'),
    shortid = require('shortid'),
    mailer = require('./app-mailer'),
    config = require('./app.node.config'),
    request = require('request');

//pass in the port via the console ... if not specified use 80
var serverPort = process.argv[2] && !isNaN(process.argv[2]) ? process.argv[2] : 80;
var config_env = process.argv[3] || "DEV";
console.log("config_env", config_env);


//allow parsing of JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

paypal.configure(config[config_env].paypal);

//admin session shit
app.use(session({
    secret: config.admin.session.secret,
    resave: true,
    saveUninitialized: true
}))
    
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] == value) {
            return i;
        }
    }
    return -1;
}

//method that checks if admin
function isAdminValid(req) {
    if (req.session && req.session.user == config.admin.manage.username && req.session.admin) {
        return true;
    } else {
        return false;
    }
}

/*THE WEBSITE*/
var staticRoot = __dirname + '/dist/';  
app.use(express.static(staticRoot));
app.use('/node_modules', express.static('/node_modules'));

//use for all static pages
function handleRouteParams(req, res, next) {
     // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }
    console.log('appt.get("/*")', req.path);

    fs.createReadStream(staticRoot + 'index.html').pipe(res);
}
//static 
app.get('/', handleRouteParams);
app.get('/product*', handleRouteParams);
app.get('/cart', handleRouteParams);
app.get('/subscribe', handleRouteParams);
app.get('/thankyou*', handleRouteParams);
app.get('/manage*', handleRouteParams);

//non static process when the payment is completed bitch
app.get('/process', function (req, res) {
    var paymentId = req.query.paymentId;
    var payerId = { payer_id: req.query.PayerID };

    //executes and pulls payment info object
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            console.error("paypal.process.error", error);
            res.redirect('/thankyou/error');
        } else {
            if (payment.state === 'approved') {
                console.log("Payment completed successfully", paymentId);
                //replace id for paypal-id then gen id
                payment.id_paypal = payment.id;
                payment.id = shortid.generate();
                payment.status = "PROCESSING";
                payment.emailContactHistory = [];
                
                var url = '/thankyou/' + payment.id;
                console.log('process.routeUrl', url);
                
                r.db('juanswood').table('orders').insert(payment).then(function (inserResult) {
                    
                    //update product quantity...
                    payment.transactions[0].item_list.items.forEach(function(item){
                        var productInfo = item.name.split(":");
                        var arr = productInfo[1].split("_"); //splits it into [#, #, #] then you can combine those to get everything...

                        var productId = arr[0];
                        var optionId = arr[0] + "_" + arr[1];
                        var dimensionId = arr[0] + "_" + arr[1] + "_" + arr[2];
                        var deductBy = item.quantity;

                        deductProductQuantity(productId, optionId, dimensionId, deductBy);
                    });


                    //send an email and then redirect that bitch
                    var htmlBody = `
                    <h3>Your purchase has been confirmed</h3>
  
                    <p>You can track the status of your order via the following link <a href="` + "https://idea23.co" + url +  `">`  + "https://idea23.co" + url + `</a></p>
        
                    <p>We will continue to update via email as the status of your order changes.</p>
                    
                    <p>If you have any questions or concerns, feel free to contact the admins at <a href= "mailto:sal@idea23.co" >sal@idea23.co</a> or <a href="mailto:busgamer7394@idea23.co">busgamer7394@idea23.co</a>.<p>
                    
                    <p>Thank you<br>idea23 Team</p>
                    `;

                    // result.payer.payer_info.email
                    mailer.sendEmail("noreply@idea23.co", payment.payer.payer_info.email, "", "Purchase Confirmation", "", htmlBody)
                        .then(function (success) {
                            console.log('/emailAdminTest.success', success);
                           
                        })
                        .catch(function (error) {
                            console.log('/emailAdminTest.error', error)
                            
                        });

                    //email admins of new order
                    mailer.sendEmail("noreply@idea23.co", "sal@idea23.co,busgamer7394@idea23.co", "", "New Order", "", "New order check manage/orders ...");
                
                    //redirect    
                    req.session.emptyCart = true;
                    res.redirect(url);
                })
            } else {
                res.redirect('/thankyou/error');
            }
        }
    })

    //utitlity function my man
    function deductProductQuantity(productId, optionId, dimensionId, deductAmount){
        deductAmount = parseInt(deductAmount)*-1;
    
        r.db('juanswood').table('products').sum(function(prod){
            var newCount =  prod('options')('1_0')('dimensions')('1_0_0')('quantity').add(deductAmount);
            return newCount;
        }).then(function(result){
            result = result < 0 ? 0 : result; //makes sure we never go below zero...
            var update = [{
                "options":{

                }
            }];
            update[0]["options"][optionId] = {"dimensions": {}};
            update[0]["options"][optionId]["dimensions"][dimensionId] = {"quantity":result};
            console.log("deductProductQuantity.update", JSON.stringify(update));

            r.db('juanswood').table('products').get(productId).update(r.args(update)).then(function(result){
                console.log("deductProductQuantity.update.result", result);
            })
        })
    }
})

/*POST-GET METHODS*/
app.post('/api/status', function (req, res) {
    
})

//admin login
app.post('/api/loginAdmin', function (req, res) {
    if (req.body.username && req.body.password) {
        if (req.body.username === config.admin.manage.username && req.body.password === config.admin.manage.password) {
            req.session.user = "adminkazuma";
            req.session.admin = true;
            res.send({ success: "true" });
        }
    }
})

app.post('/api/auth', function (req, res) {
    if (isAdminValid(req)) {
        res.send({ auth: true });
    } else {
        res.send({ auth: false });
    }
})

//creates paypal checkout!
app.post('/api/create', function (req, res) {
    console.log("post.create", JSON.stringify(req.body));
    //build PayPal payment request
    var payReq = {
        intent: 'sale',
        redirect_urls: {
            return_url: config[config_env].server.paypal.return_url,
            cancel_url: config[config_env].server.paypal.cancel_url
        },
        payer: {
            payment_method: 'paypal'
        },
        transactions: [{
            amount: {
                total: parseFloat(req.body.total.toString()).toFixed(2),
                currency: 'USD'
            },
            description: '',
            item_list: {
                items: req.body.items
            },
        }]
    };

    paypal.payment.create(payReq, function (error, payment) {
        if (error) {
            console.error("paypal.payment.create.error", JSON.stringify(error));
            console.error("paypal.payment.create.errorDetails", error.details);
        } else {
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function (linkObj) {
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })

            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')) {
                // res.redirect(links['approval_url'].href);
                res.send({ link: links['approval_url'].href });

            } else {
                console.error('no redirect URI present');
            }
        }
    });
})

//pulls product(s)
app.post('/api/product', function (req, res) {
    if (req.body.get === "all") {
        r.db('juanswood').table('products').then(function (productList) {
            res.send(productList);
        })
    } else if (req.body.get === "id") {
        var id = req.body.id;

        r.db('juanswood').table('products').get(id).then(function (product) {
            res.send(product);
        })
    }

})

app.post('/api/productSave', function (req, res) {
    //check auth my dude
    if (isAdminValid(req)) {
        r.db('juanswood').table('products').get(req.body.id).replace(req.body).run().then(function (result) {
            res.send({ result: result });
        })
    }
})

app.post('/api/productRemove', function (req, res) {
    if (isAdminValid(req)) {

        r.db('juanswood').table('products').get(req.body.id).delete().then(function (result) {
            res.send({ result: result });
        })
    }
})

app.post('/api/getOrders', function(req, res) {
    if (isAdminValid(req)) {
        r.db('juanswood').table('orders').orderBy(r.desc("create_time")).then(function(orderList) {
            res.send(orderList);
        })
    }
})

//subscribe
app.post('/api/subscribe', function (req, res) {
    if (req.body.email && req.body.name) {
        r.db('juanswood').table('subscriptions').insert({ email: req.body.email, name: req.body.name }).then(function (result) {
            if(result.inserted == 1){
                //send email saying thanks bitch
                var htmlBody = `
                    <h3>Hey ` + req.body.name + `! Thanks for subscribing!</h3>
    
                    <p>You will start receiving product updates & special offers! </p>

                    <p>We promise it wont be as often and annoying as other subscriptions ;)</p>
                    
                    <p>If you have any questions or concerns, feel free to contact the admins at <a href= "mailto:sal@idea23.co" >sal@idea23.co</a> or <a href="mailto:busgamer7394@idea23.co">busgamer7394@idea23.co</a>.<p>
                    
                    <p>Thank you<br>idea23 Team</p>
                `;

                mailer.sendEmail("noreply@idea23.co", req.body.email, "", "Subscription Confirmation", "", htmlBody);
            }

            res.send({ result: result });
        })
    }
})

app.post('/api/emailadmin', function (req, res) {
    //from, to, subject, text, html
    if (isAdminValid(req)) {
        mailer.sendEmail("noreply@idea23.co", req.body.to, "", req.body.subject, req.body.body, req.body.html)
            .then(function (emailResult) {
                console.log('/emailadmin.success', emailResult);
                
                //updated the order email contact history
                if(req.body.orderID && req.body.orderID.length > 0){
                    r.db('juanswood').table('orders').get(req.body.orderID).update({emailContactHistory: r.row('emailContactHistory').append({subject: req.body.subject, body: req.body.body, html: req.body.html, timestamp: r.now()})})
                        .then(function(result){
                            emailResult.dbResult = result;
                            res.send(emailResult);
                        })
                } else 
                    res.send(emailResult);
            })
            .catch(function (error) {
                console.log('/emailadmin.error', error)
                res.send(error);
            });
    }
});

app.post('/api/updateOrderStatus', function(req, res) {
    if(isAdminValid(req)){
        r.db('juanswood').table('orders').get(req.body.orderID).update({status: req.body.status}).then(function(result){
            res.send(result);
        })
        .catch(function(error){
            res.send(error);
        })
    }
})

//create the fucking server
http.createServer(app).listen(serverPort, function () {
    console.log('Server started', serverPort);
})

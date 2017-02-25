var express = require('express');
var router = express.Router();

//middle ware
router.use(function(req, res, next) {
    console.log("router.use", "request.made");
    next();
});

router.route('/status').post(function(req, res) {
    console.log('status.paymentId', req.body.paymentId);

    if (req.body.paymentId) {
        r.db('juanswood').table('orders').get(req.body.paymentId).then(function (order) {
            //fetch order details
            var key_id = [];
            var dim_id = [];
            var pluck_script = [];
            for (var j = 0; j < order.transactions[0].item_list.items.length; j++) {
                key_id.push(String(order.transactions[0].item_list.items[j].sku));
                dim_id.push(order.transactions[0].item_list.items[j].name.split(":")); //splits the id of the dim from the product name
            }

            dim_id.forEach(function(list){
                var db = list[1].split("_");
                var productOptionKey = String(db[0] + "_" + db[1]);

                var pluck_object = {};
                pluck_object[productOptionKey] = [
                    'name',
                    'imgUrl',
                    {
                        'dimensions': [
                                list[1].toString()
                        ]
                    }
                ];
                pluck_script.push(pluck_object);
            })

            console.log("juanswood.orders.dim_id", dim_id);
            console.log("juanswood.orders.getAll", key_id);
            console.log("juanswood.orders.pluck_script", JSON.stringify(pluck_script));

            r.db('juanswood').table('products').getAll(r.args(key_id)).getField('options').pluck(r.args(pluck_script))
                .then(function(products){
                    console.log("juanswood.order.r.db.result", products);
                    //setSelDimension(products, key_id, dim_id, order.transactions[0].item_list.items);
                    order.product_list = products;

                    if(req.session.emptyCart && req.session.emptyCart == true){
                        order.emptyCart = true;
                        req.session.emptyCart = false;
                    } else {
                        order.emptyCart = false;
                    }
                
                    res.send(order);
                });

        });
    } else {
        res.send({ error: true });
    }
})

router.route('/loginAdmin').post(function(req, res) {
    if (req.body.username && req.body.password) {
        if (req.body.username === config.admin.manage.username && req.body.password === config.admin.manage.password) {
            req.session.user = "adminkazuma";
            req.session.admin = true;
            res.send({ success: "true" });
        }
    }
})

router.route('/auth').post(function(req, res) {
    if (isAdminValid(req)) {
        res.send({ auth: true });
    } else {
        res.send({ auth: false });
    }
})

router.route('/status').post(function(req, res) {
    
})

router.route('/create').post(function(req, res) {
    
})

router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})
router.route('/status').post(function(req, res) {
    
})

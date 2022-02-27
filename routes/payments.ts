const razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

import { Router, response, request } from "express";
const route = Router();

var instance = new razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});

export default (app : Router) => {
    app.use("/payment", route);

    route.get('/', (req : request, res : response) => {
        res.sendFile("payments.html", {root: __dirname});
    })

    route.post('/orderId', (req: request, res: response) => {
        let amount = parseInt(req.body.amount)*100;
        let linkedamount = parseInt(req.body.amount)*90;
        
        let options = {
            amount: amount,
            currency: "INR",
            receipt: "rptID",
            transfers: [{
                account: "acc_J0PimozoqwyWnD",
                amount: linkedamount,
                currency: "INR",
                on_hold: 0,
            }]
          };

          instance.orders.create(options, (err, order) => {
            if(err){
                console.log(err);
                return;
            }
            console.log(order);
            res.send({orderId: order.id, key_id: process.env.KEY_ID});
          });
        })

        route.post('/verification', (req: request, res: response) => {
            let body=req.body.orderId+ "|" + req.body.razorpay_payment_id;
            let crypto = require("crypto");
            let expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
                                            .update(body.toString())
                                            .digest('hex');
                                        //  console.log("sig received -> " ,req.body.razorpay_signature);
                                        //  console.log("sig generated -> " ,expectedSignature);
            let response = {"signatureIsValid": false}
            if(expectedSignature === req.body.razorpay_signature){
                response={"signatureIsValid": true}
            }
            res.send(response);
        })

}
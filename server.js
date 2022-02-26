const express = require('express');
require('dotenv').config();
const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const razorpay = require('razorpay');


//* MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

var instance = new razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});




app.get('/', (req, res) => {
    res.sendFile("payments.html", {root: __dirname});
})




app.post('/payment/orderId', (req, res) => {
    // console.log('Create OrderID request', req.body);
    var amount = parseInt(req.body.amount)*100;
    var linkedamount = parseInt(req.body.amount)*90;

    var options = {
        amount: amount,  // amount in the smallest currency unit
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



app.post("/payment/verification",(req,res)=>{
    //console.log(req.body);
    let body=req.body.orderId+ "|" + req.body.razorpay_payment_id;
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
                                     .update(body.toString())
                                     .digest('hex');
                                    //  console.log("sig received -> " ,req.body.razorpay_signature);
                                    //  console.log("sig generated -> " ,expectedSignature);
     var response = {"signatureIsValid": false}
     if(expectedSignature === req.body.razorpay_signature){
        response={"signatureIsValid": true}
     }
     res.send(response);
});




   
//* PORT
const port = process.env.PORT || 8000;

//* STARTING SERVER
app.listen(port, () => {
    console.log(`App is running at ${port}`);
});
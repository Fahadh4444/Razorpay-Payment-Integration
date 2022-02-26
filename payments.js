const getOrderId = () => {
    //amount -> should get from front end
    amount = 500
    fetch("http://localhost:8000/payment/orderId", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({amount : `${amount}`})
    })
    .then((res) => res.json())
    .then((res) => {
        // console.log(orderId);
        razorPayPopup(amount, res.key_id, res.orderId);
    }).catch((err) => {
        console.log(err);
    })
}

const paymentCapture = (response, orderId) => {
        razorpay_payment_id = response.razorpay_payment_id,
        razorpay_order_id = response.razorpay_order_id,
        razorpay_signature = response.razorpay_signature,
        orderId = orderId

        fields = {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderId
        }

    fetch("http://localhost:8000/payment/verification", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fields)
    })
    .then((res) => res.json())
    .then((res) => {
        // console.log(res);
        if(!res.signatureIsValid){
            alert('Invalid payment!!!');
            //TODO: Rollback payment
            return;
        }
        alert(`Your payment is successfull with paymentId: ${response.razorpay_payment_id} !!!`)
        //TODO: Add razorpay payment Id in Database
    })
    .catch((err) => {
        alert('Invalid payment!!!');
    })
}

const loadScript = (url) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = url;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    })
}

const razorPayPopup = (amount, key_id, orderId) => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
    .then((res) => {
        if(!res){
            alert('Failed to load razorpay SDK...due to internet issuse!!!');
            return;
        }

        var options = {
            "key": key_id, // Enter the Key ID generated from the Dashboard
            "amount": `${amount*100}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Harry Potter",
            "description": "Playcub Transactions",
            "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the previous step
            "handler": function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature);
                paymentCapture(response, orderId);
            },
            "prefill": {
                "name": "Fahadh",
                "email": "fahadh@fullbuster.com",
                "contact": "9999999999"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
                // alert(response.error.code);
                // alert(response.error.description);
                // alert(response.error.source);
                // alert(response.error.step);
                // alert(response.error.reason);
                // alert(response.error.metadata.order_id);
                // alert(response.error.metadata.payment_id);
                alert('Payment Failed!!!')
        });
        document.getElementById('rzp-button').onclick = function(e){
            rzp1.open();
            e.preventDefault();
        }
    })
}


getOrderId();
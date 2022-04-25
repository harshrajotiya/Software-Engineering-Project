const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "8kxh7v4cn5smv2w7",   // get all these values from your braintree account private key area. 
  publicKey: "468qf8yftdh8qh59",    // without that token will not generate so it is a crucial step
  privateKey: "e17436089bc4c18864031dfee5586e35"
});

exports.getToken = (req , res) => {
    gateway.clientToken.generate({}, (err, response) => { // we removed the customeer Id part. // wee can always 
                                                            // modify things according to our comfort.
                        // pass clientToken to your front-end
        if(err){
            console.log(err)
            return res.status(400).send(err)
        }
        else{
            console.log(response)
            return res.send(response)
        }
      });
}

exports.processPayment = () => {

    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        // deviceData: deviceDataFromTheClient,           we removed it as it was optional 
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              return res.status(500).json(err)
          }
          else {
              return res.json(result)
          }
      });
}
// to process a payment we need transaction so we copy transaction code

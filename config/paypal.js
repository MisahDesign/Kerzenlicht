'use strict';

/**
 *
 * PayPal Node JS SDK dependency
 */
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
request.headers["prefer"] = "return=representation";

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'AchJ1Qwa5PP429Mi0ZZTHsN4PAr6trWeBGcOEO1FKHPyDDJI2ojlnHm5jiq5cmlyCCYULrQGgi1EjNha';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EPn99kqAjsYHSXMCF_fxJXtO9oKMU9yhdtZ9xV3E1Rm3IUHIMY98VlkVJAJd-VIGdI6AUL-IyC1CSBKe';

    return new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
    );
}

async function prettyPrint(jsonData, pre=""){
    let pretty = "";
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    for (let key in jsonData){
        if (jsonData.hasOwnProperty(key)){
            if (isNaN(key))
              pretty += pre + capitalize(key) + ": ";
            else
              pretty += pre + (parseInt(key) + 1) + ": ";
            if (typeof jsonData[key] === "object"){
                pretty += "\n";
                pretty += await prettyPrint(jsonData[key], pre + "    ");
            }
            else {
                pretty += jsonData[key] + "\n";
            }

        }
    }
    return pretty;
}

module.exports = {client: client, prettyPrint:prettyPrint};

module.exports = async function handleRequest(req, res) {

    // 2a. Get the order ID from the request body
    const orderID = req.body.orderID;
  
    // 3. Call PayPal to get the transaction details
    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);
  
    let order;
    try {
      order = await payPalClient.client().execute(request);
    } catch (err) {
  
      // 4. Handle any errors from the call
      console.error(err);
      return res.send(500);
    }
  
    // 5. Validate the transaction details are as expected
    if (order.result.purchase_units[0].amount.value !== '220.00') {
      return res.send(400);
    }
  
    // 6. Save the transaction in your database
    // await database.saveTransaction(orderID);
  
    // 7. Return a successful response to the client
    return res.send(200);
  }
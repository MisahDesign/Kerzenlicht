

let $button = $("#pay");

 $button.click(function (event) {
     var priceElement = $(".totalPrice")[0];
     var price = parseFloat(priceElement.innerText.replace("EUR",""))* 100;
     stripeHandler.open({
         amount: price 
     })
 });




 var stripeHandler = StripeCheckout.configure({
     key: stripePublicKey,
     locale: "de",
     token: function(token) {
        var items = {};
        items = cart.items;
        console.log(items);
     }
 });
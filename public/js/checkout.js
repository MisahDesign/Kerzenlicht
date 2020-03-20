// var stripe = Stripe('pk_test_MbfAJcWOAPIjOhdbjf3jydBh00nE97Eg3m');

// if (document.readyState == 'loading') {
//     document.addEventListener('DOMContentLoaded', ready)
// } else {
//     ready()
// }

let $button = $("#pay");

 $button.click(function (event) {
     var priceElement = $(".totalPrice")[0];
     var price = parseFloat(priceElement.innerText.replace("EUR",""))* 100;
     stripeHandler.open({
         amount: price 
     })
 });


// console.log(totalPrice);
// function stripeResponseHandler(status, response) {
//     if (response.error) {
//         $("#charge_error").text(response.error.message);
//         $("#charge_error").removeClass("hidden");
//         $form.find("#pay").prop("disabled", false);
//     } else {
//         let token = response.id;
//         $form.append($('<input type="hidden" name="stripeToken" />').val(token));
//         $form.get(0).submit;
//     }
// }

 var stripeHandler = StripeCheckout.configure({
     key: stripePublicKey,
     locale: "de",
     token: function(token) {
        var items = {};
        items = cart.items;
        console.log(items);
     }
 });
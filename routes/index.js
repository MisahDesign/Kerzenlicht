if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;



const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Comment = require("../models/comments");
const Cart = require("../models/cart");
const middleware = require("../middleware");
const stripe = require('stripe')(stripeSecretKey);








router.get("/", function (req, res) {
  res.render("landing.ejs", {
    currentUser: req.user
  });
})

router.get("/pricelist", function (req, res) {
  res.render("pricelist.ejs");
})

router.get("/aboutme", function (req, res) {
  res.render("aboutme.ejs")
})

router.get("/waxing", function (req, res) {
  res.render("waxing.ejs")
})

router.get("/contact", function (req, res) {
  res.render("contact.ejs")
})

router.get("/guestbook", function (req, res) {
  Comment.find({}, function (err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.render("guestbook.ejs", {
        comment: comment
      });

    }
  });
});

//Comments Create
router.post("/guestbook", function (req, res) {
  Comment.create({
    text: req.body.comment
  }, function (err, comment) {
    if (err) {
      console.log(err);
    } else {

      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.text = req.body.comment;

      comment.save();
      console.log(comment);
      req.flash('success', 'Created a comment!');
      res.redirect("/guestbook");
    }
  });
});
//Commments Edit
router.get("/guestbook/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("edit.ejs", {
        comment_id: req.params.comment_id,
        comment: foundComment
      });
    }
  });
});

router.put("/guestbook/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, {
    text: req.body.comment
  }, function (err, comment) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/guestbook");
    }
  })
});
//Comments Delete
router.delete("/guestbook/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/guestbook");
    }
  })
});

router.get("/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shop');
  });
});





router.get("/shop", function (req, res) {
  Product.find({}, function (err, products) {
    if (err) {
      console.log(err);
    } else {
      var cart = new Cart(req.session.cart ? req.session.cart : {});
      req.session.cart = cart;
      console.log(cart);
      res.render("shop.ejs", {
        stripePublicKey: stripePublicKey,
        products: products,
        totalQty: cart.totalQty
      });
    }
  });
});

router.get("/shopping-cart", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("shopping-cart.ejs", {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render("shopping-cart.ejs", {
    stripePublicKey: stripePublicKey,
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get("/success", function(req, res, next){
 


});

router.get("/reduce/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart')
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get("/checkout", function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  let cart = new Cart(req.session.cart);
  let errMsg = req.flash("error")[0];
  res.render('checkout.ejs', {
    stripePublicKey: stripePublicKey,
    cart: cart,
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});

router.post("/checkout", async function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  // You can return promise directly
  let cart = new Cart(req.session.cart);
  let customerId = {};

  let createCustomer = function () {
    var param = {};
    param.email = req.body.email;
    param.name = req.body.name;
    param.description = "";
    stripe.customers.create(param, function (err, customer) {
      if (err) {
        console.log("err:" + err);
      }
      if (customer) {
        console.log("success: " + JSON.stringify(customer, null, 2));
        debugger;
      
      } else {
        console.log("something went wrong");
      }
    });


  };

  let createToken = function () {
    let param = {};

    param.card = {
      number: req.body.card,
      exp_month: req.body.exp_month,
      exp_year: req.body.exp_year,
      cvc: req.body.security
    }
    stripe.tokens.create(param, function (err, token) {
      if (err) {
        console.log("err:" + err);

      }
      if (token) {
        console.log("success: " + JSON.stringify(token, null, 2));
       
        debugger;
        
      } else {
        console.log("something went wrong");
      }
    });
  };




  let addCardToCustomer = function (customerId, tokenId) {
    debugger;
    stripe.customers.createSource(customerId.id, {
      source: tokenId.id
    }, function (err, card) {
      if (err) {
        console.log("err:" + err);

        
        
        debugger;


      }
      if (card) {
        console.log("success: " + JSON.stringify(card, null, 2));
        return addCard;
      } else {
        console.log("something went wrong");
      }
    });
  };

  let chargeCustomerThroughCustomerID =  function (customerId) {
    let param = {
      amount: cart.totalPrice * 100,
      currency: 'eur',
      description: 'First payment',
      customer: customerId.id
    }

    return stripe.charges.create(param, function (err, charge) {
      if (err) {
        console.log("err: " + err);
      }
      if (charge) {
        console.log("success: " + JSON.stringify(charge, null, 2));

      } else {
        console.log("Something wrong")
      }
    })
  }


  try {
    const customerId = await createCustomer(); // promise 1
    debugger;
    const tokenId = await createToken();
    debugger;
    const addedCardToCustomer = await addCardToCustomer(tokenId, customerId); // await addCardToCustomer(createdCustumer); to pass created customer info to next request
    const chargedCustomerThroughCustomerID = await chargeCustomerThroughCustomerID(customer); // promise 3
    // more things...

    res.redirect("/success");

  } catch (e) {
    console.log(`error ${e}`)
  };



});




// or use async /await
let chargeCustomerThroughCustomerID = async function () {

  const data = await stripe.charges.create(param).catch((e) => {
    console.log(`error ${e}`);
    throw e
  })
  // do something with data

  return data;

}
let chargeCustomerThroughTokenID = async function () {

  const data = await stripe.charges.create(param).catch((e) => {
    console.log(`error ${e}`);
    throw e
  });
  // do something with data

  return data;

}




// var cart = new Cart(req.session.cart);
// (async () => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [{
//       name: 'T-shirt',
//       description: 'Comfortable cotton t-shirt',
//       images: ['https://example.com/t-shirt.png'],
//       amount: 500,
//       currency: 'eur',
//       quantity: 1,
//     }],
//     success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
//     cancel_url: 'https://example.com/cancel',
//   });
// })();







// var param = {};
// param.email = req.body.email;
// param.name = req.body.name;
// param.description = "new purchase";





// var param_charge = {};
// param_charge.amount = cart.totalPrice;
// param_charge.currency = 'eur';
// param_charge.description = 'First payment';

// var param = {};
// param.email = req.body.email;
// param.name = req.body.name;
// param.description = "I am the description";


// param_card = {};
// param_card ={
//   number: req.body.card,
//   exp_month: req.body.expire_month,
//   exp_year: req.body.expire_year,
//   cvc: req.body.security
// }

// let createCustomer = function () {

//   return new Promise((resolve, reject) => {
//   stripe.customers.create(param, function (err, customer) {
//     if (err) {
//       console.log("err:" + err);
//       reject();
//     }
//     if (customer) {
//       console.log("success: " + JSON.stringify(customer, null, 2));
//       param.customer = customer.id;

//       resolve();
//     } else {
//       console.log("something went wrong");
//     }
//   });
// })};


// // createCustomer();

// let createToken = function () {

//   // return new Promise((resolve, reject) => {
//     stripe.tokens.create(param_card, function (err, token) {
//       if (err) {
//         console.log("err:" + err);
//         console.log(param_card);
//         // reject();
//       }
//       if (token) {
//         console.log("success: " + JSON.stringify(token, null, 2));
//         param.tokenId = token.id;
//         // resolve();
//       } else {
//         console.log("something went wrong");
//       }
//     });
//   };







// let retrieveCustomer = function () {
//   stripe.customers.retrieve("cus_Gr83WnHukPgD90", function (err, customer) {
//     if (err) {
//       console.log("err:" + err);
//     }
//     if (customer) {
//       console.log("success: " + JSON.stringify(customer, null, 2));
//     } else {
//       console.log("something went wrong");
//     }
//   });
// }

// // retrieveCustomer();


// let addCardToCustomer = function () {
//   stripe.customers.createSource(param.customer, {
//     source: param.tokenId
//   }, function (err, card) {
//     if (err) {
//       console.log("err:" + err);
//       console.log(param);
//     }
//     if (card) {
//       console.log("success: " + JSON.stringify(card, null, 2));
//     } else {
//       console.log("something went wrong");
//     }
//   });
// };

// let chargeCustomerThroughCustomerID = function () {

//   let param = {
//     amount: cart.totalPrice,
//     currency: 'eur',
//     description: 'First payment',
//     customer: customer.id
//   }

//   stripe.charges.create(param, function (err, charge) {
//     if (err) {
//       console.log("err: " + err);
//     }
//     if (charge) {
//       console.log("success: " + JSON.stringify(charge, null, 2));
//     } else {
//       console.log("Something wrong")
//     }
//   })
// }
// //chargeCustomerThroughCustomerID();

// let chargeCustomerThroughTokenID = function () {

//   let param = {
//     amount: cart.totalPrice,
//     currency: 'eur',
//     description: 'First payment',
//     source: token.id
//   }

//   stripe.charges.create(param, function (err, charge) {
//     if (err) {
//       console.log("err: " + err);
//     }
//     if (charge) {
//       console.log("success: " + JSON.stringify(charge, null, 2));
//     } else {
//       console.log("Something wrong")
//     }
//   })
// }

// createCustomer().then(createToken).then(addCardToCustomer).catch(err => console.log(err));


//     stripe.tokens.create(param_card, function(err, token){
//       if(err) {
//         console.log("err:" + err);
//       } if(token) {
//         console.log("success: "+ JSON.stringify(token, null, 2));
//         param.source = token.id;
//         console.log(param);

//       } else {
//         console.log("error token create");
//       }
//     });
//     stripe.customers.create(param, function(err, customer){
//       if(err) {
//         console.log("err:" + err);
//       } if(customer) {
//         console.log("success: "+ JSON.stringify(customer, null, 2));
//         param.customer = customer.id;
//         param_charge.customer = customer.id;
//       } else {
//         console.log("error customer create");
//       }
//     })

//     .then (customer  => stripe.customers.createSource(customer.id,{source:param.source},function(err, card){
//       if(err) {
//         console.log("err:" + err);
//         console.log(param);
//         console.log(param.source);
//       } if(card) {
//         console.log("success: "+ JSON.stringify(card, null, 2));
//         console.log(param_charge);
//       } else {
//         console.log("error source create");
//       }
//     }))
//     .then ( card => stripe.charges.create(param.customer, function (err,charge) {
//       if(err)
//       {
//           console.log("err: "+err);
//       }if(charge)
//       {
//           console.log("success: "+JSON.stringify(charge, null, 2));
//       }else{
//           console.log("Something wrong")
//       }
//   }))
//   .catch((err) => {
//     console.log(err);
//   });








// stripe.charges.create({
//   amount: cart.totalPrice * 100,
//   currency: "eur",
//   source: req.body.stripeToken,
//   description: "Test Charge"
// }, function(err, charge) {
//   if (err) {
//     req.flash("error", err.message);
//     return res.redirect("/checkout")
//   }
//   req.flash("success", "Successfully purchased a product!");
//   req.cart = null;
//   res.redirect("/shopping-cart");
// });









module.exports = router;
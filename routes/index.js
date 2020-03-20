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
const passport = require('passport');
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
    const customerId = await createCustomer();
    debugger;
    const tokenId = await createToken();
    debugger;
    const addedCardToCustomer = await addCardToCustomer(tokenId, customerId); 
    const chargedCustomerThroughCustomerID = await chargeCustomerThroughCustomerID(customer);

    res.redirect("/success");

  } catch (e) {
    console.log(`error ${e}`)
  };



});




let chargeCustomerThroughCustomerID = async function () {

  const data = await stripe.charges.create(param).catch((e) => {
    console.log(`error ${e}`);
    throw e
  })


  return data;

}
let chargeCustomerThroughTokenID = async function () {

  const data = await stripe.charges.create(param).catch((e) => {
    console.log(`error ${e}`);
    throw e
  });


  return data;

}

// USERROUTES

router.get("/profile", middleware.isLoggedIn, function(req, res){
  res.render("profile.ejs");
});

// LOGOUT LOGIC 
router.get("/logout", middleware.isLoggedIn, function (req, res){
  req.logout();
  res.redirect("/");
});

router.use('/', middleware.notLoggedIn, function(req, res, next){
  next();
});

router.get("/register", function(req, res){
  var messages = req.flash('error');
  res.render("register.ejs", {messages: messages, hasErrors: messages.length > 0});
});



router.post("/register", passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/register',
  failureFlash: true
}));



// LOGIN FORM
router.get("/login", function(req, res){
  var messages = req.flash('error');
  res.render("login.ejs", {messages: messages, hasErrors: messages.length > 0});
});



//  LOGIN LOGIC
router.post("/login", passport.authenticate("local.signin",
  {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }));




module.exports = router;
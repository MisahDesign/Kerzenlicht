const mongoose = require("mongoose");


var productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    info: {type: String, required: true}
  });



module.exports = mongoose.model("Product", productSchema);


  

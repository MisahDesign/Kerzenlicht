var Comment = require("../models/comments");

var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://misah:w9AcfjsFakqkD3wq@cluster0-lygfd.mongodb.net/test?retryWrites=true&w=majority", {dbName: 'kerzenlicht'});



var data = [ 
    new Comment({
    text: 'Moisture Surge Intense',
    
    author: "Mario"
}),
new Comment({
    text: 'Moisture Surge Intense',
    
    author: "Mario"
}),


    
];


function seedComments(){
data.forEach(function(comment){
    Comment.create(comment, function(err, data){
        if (err) {
            console.log(err);
        } else {
            console.log(comment.author);
        }
    });
});
};

seedComments();

module.exports = seedComments();


let middlewareObj = {};
const Comment = require("../models/comments");

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
              res.redirect("/");
            } else {
              if(foundComment.author.id.equals(req.user._id)){
                next();
              } else {
                res.redirect("/");
              }
            }
          });
        } else {
          res.redirect("/");
        }
    }

 middlewareObj.isLoggedIn = function(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/");
    };
 

 middlewareObj.notLoggedIn = function(req,res, next){
    if(!req.isAuthenticated()){
      return next();
    }
    res.redirect("/");
  };

 
  
  


module.exports = middlewareObj;
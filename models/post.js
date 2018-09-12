const mongoose = require('mongoose');
const config = require('../config/database');

var Schema = mongoose.Schema;
var postSchema = new Schema({
  title: {type: String},
  info: {type: String},
  posted: {type: Date, default: Date.now},
  op: {type:String}
});

var Post = mongoose.model('Post', postSchema);
module.exports = Post;

// save new post to post model
module.exports.createPost = function(newPost, callback){
  //console.log(newPost);
  newPost.save(callback);
}

// get all posts from posts collection
module.exports.getAllPosts = function(callback){
  Post.find({}, (err, allPosts)=>{
    if(err){
      console.log('get all posts database error');
      return false;
    } else {
      callback(null, allPosts);
    }
  });
}

// delete a post with postId
module.exports.deletePost = function(postId, callback){
  Post.deleteOne({_id:postId}, (err, status)=>{
    if(err) throw err;
    else{
      //console.log(status);
      callback(null, status);
    }
  });
}
// retrive post from database using id
module.exports.getPostFromId = function(postId, callback){
  Post.findById(postId, (err,post)=>{
    if(err) throw err;
    else{
      callback(null, post);
    }
  });
}
// update post body in collection
module.exports.updatePost = function(postId, post, callback){
  Post.updateOne({_id:postId}, {
			   title: post.title,
			   info: post.info
		   }, (err,status)=>{
         if(err) throw err;
         else{
           callback(status);
         }
  });
}

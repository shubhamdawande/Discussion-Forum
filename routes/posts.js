const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Post = require('../models/post');
//const User = require('../models/user');

// create a post
router.post('/blogposts', (req,res,next) => {
  let newPost = new Post({
    title: req.body.title,
    info: req.body.info,
    op: req.body.op
  });

  // create new post
  Post.createPost(newPost, (err, post) => {
    if(err){
      //console.log('create post error')
      res.json({success: false, msg: 'Backend error while creating new post'});
    } else {
      //console.log('newPost', newPost);
      res.json({success: true, msg: 'New post created and saved to database'});
    }
  });

});

// get all posts
router.get('/blogposts/all', (req,res,next)=>{
  Post.getAllPosts((err, allPosts)=>{
    //console.log(allPosts);
    if(err) throw err;
    res.send({success:true, data: allPosts});
  });
});

//delete a post
router.delete('/blogposts/:id', (req,res,next)=>{
  const postId = req.params.id;
  //console.log(req.params, req.body);
  Post.deletePost(postId, (err,status)=>{
    if(err){
      res.send({success:false});
    }else{
      res.send({success:true});
    }
  })
});

// get post from post id
router.get('/blogposts/:id', (req,res,next)=>{
  const postId = req.params.id;
  Post.getPostFromId(postId, (err,post)=>{
    if(err) throw err;
    else{
      res.send({success:true, post:post});
    }
  });
});

// update post
router.put('/blogposts/:id', (req,res,next)=>{
  const postId = req.params.id;
  let post = req.body;
  Post.updatePost(postId, post, (status)=>{
    res.send({success:true, status:status});
  });
});

module.exports = router;

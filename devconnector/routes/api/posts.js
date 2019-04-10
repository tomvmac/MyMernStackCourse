const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Load Input Validation
const validatePostInput = require('../../validation/post');

// @route      GET api/posts/test
// desc        Tests post route
// @access     Public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));


// @route      GET api/posts
// desc        Get a post
// @access     Public 
router.get('/', (req, res) => {
    const errors = {};
    errors.noPostFound = "No post found";

    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json(errors));

});

// @route      GET api/posts
// desc        Get a post by post id
// @access     Public 
router.get('/:id', (req, res) => {
    const errors = {};
    errors.noPostFound = "No post found with given id";

    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json(errors));

});


// @route      POST api/posts
// desc        Create a post
// @access     Private
router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {

    // Validate input
    const {errors, isValid} = validatePostInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }

    // let newPost = new Post({}); 
    // newPost = {...req.body};
    // newPost.user = req.user.id;

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      });

    newPost.save()
        .then(post => res.json(post));

});


// @route      DELETE api/posts
// desc        Delete a post
// @access     Private 
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    console.log("user", req.user.id);
    Profile.findOne({user: req.user.id})
        .then(profile => {
            console.log("Found profile for user");
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({notauthorized: 'User not authorized'});
                    }

                    // Delete
                    post.remove()
                        .then(() => res.json({success: true}))
                        .catch(err => res.status(404).json({postnotfound: 'No post found'}));

                });
        })
        .catch(err => res.status(404).json({noprofile: 'No profile found'}));
        
});

module.exports = router;


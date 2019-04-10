const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Load Input Validation
const validationProfileInput = require('../../validation/profile');
const validationExperienceInput = require('../../validation/experience');
const validationEducationInput = require('../../validation/education');



// @route      GET api/profile/test
// desc        Tests profile route
// @access     Public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));


// @route      GET api/profile
// desc        Get current user profile
// @access     Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .populate(
          'user',
          ['name', 'avatar']
        )
        .then(profile => {
            if (!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            } 
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// @route      GET api/profile/handle/:handle
// desc        Get user profile by handle
// @access     public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({handle: req.params.handle})
    .populate(
      'user',
      ['name', 'avatar']
    )
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors)
    });
  
});


// @route      GET api/profile/user/:user_id
// desc        Get user profile by user id
// @access     public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({user: req.params.user_id})
    .populate(
      'user',
      ['name', 'avatar']
    )
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors)
    });
  
});


// @route      GET api/profile/all
// desc        Get all user profiles 
// @access     public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find({})
    .populate(
      'user',
      ['name', 'avatar']
    )
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = 'There are no profiles';
      res.status(404).json(errors)
    });
  
});


// @route      POST api/profile
// desc        Create user profile
// @access     Private
router.post('/', 
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        // Validate input
        const {errors, isValid} = validationProfileInput(req.body);

        if (!isValid){
            return res.status(400).json(errors);
        }    


        // Get Fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
        profileFields.githubusername = req.body.githubusername;
        // Skills - Split into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id }).then(profile => {
            if (profile) {
              // Update
              Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
              ).then(profile => res.json(profile));
            } else {
              // Create
      
              // Check if handle exists
              Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                  errors.handle = 'That handle already exists';
                  res.status(400).json(errors);
                }
      
                // Save Profile
                new Profile(profileFields).save().then(profile => res.json(profile));
              });
            }
          });
    }
);


// @route      POST api/profile/experience
// desc        Post experience to profile 
// @access     private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Validate input
  const {errors, isValid} = validationExperienceInput(req.body);

  if (!isValid){
      return res.status(400).json(errors);
  }    

  Profile.findOne({user: req.user.id})
    .then(profile => {
      // Populate default experience with req body fields
      const newExp = {...req.body};
      // Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));

    })

});


// @route      DELETE api/profile/experience/:exp_id
// desc        Delete experience from profile 
// @access     private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log("deleting exp id: ", req.params.exp_id);
  Profile.findOne({user: req.user.id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);
      
      // Save
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));

    });

});




// @route      POST api/profile/education
// desc        Post education to profile 
// @access     private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Validate input
  const {errors, isValid} = validationEducationInput(req.body);

  if (!isValid){
      return res.status(400).json(errors);
  }    

  Profile.findOne({user: req.user.id})
    .then(profile => {
      // Populate default experience with req body fields
      const newEdu = {...req.body};
      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));

    })

});


// @route      DELETE api/profile/education/:edu_id
// desc        Delete education from profile 
// @access     private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log("deleting edu id: ", req.params.edu_id);
  Profile.findOne({user: req.user.id})
    .then(profile => {
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);
      
      // Save
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));

    });

});


module.exports = router;
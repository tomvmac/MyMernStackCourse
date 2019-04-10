const express = require('express');
const router = express.Router();

// @route      GET api/hello/
// desc        Post experience to profile 
// @access     public
router.get('/', (req,res) => {
    const defaultGreeting = {'greeting': 'hello'}; 
  
    res.json(defaultGreeting);
  });


// @route      POST api/hello/destructor
// desc        Post experience to profile 
// @access     public
router.post('/destructor', (req,res) => {
    const defaultUser = {};
    const {firstName, lastName} = req.body;
    defaultUser.firstName = firstName;
    defaultUser.lastName = lastName;
  
  
    res.json(defaultUser);
  });
  
  // @route      POST api/hello/spread
  // desc        Post experience to profile 
  // @access     public
  router.post('/spread', (req,res) => {
    const defaultUser = { ...req.body};
  
    res.json(defaultUser);
  });


  module.exports = router;
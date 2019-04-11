const express = require("express");
const router = express.Router();
const axios = require('axios');

// @route      GET api/hello/
// desc        Post experience to profile
// @access     public
router.get("/", (req, res) => {
  const defaultGreeting = { greeting: "hello" };

  res.json(defaultGreeting);
});

// @route      GET api/hello/
// desc        Post experience to profile
// @access     public
router.get("/greet/:name", (req, res) => {
  const myGreeting = { greeting: req.params.name };

  // access external api to get greeting 
  // const greetingUrl = "http://localhost:8081/greet/name/" + req.params.name;
  // const greetingFromApi = axios.get(greetingUrl)
  //   .then(response => {
  //     console.log(myGreeting);
  //     console.log(response.data);
  //     return response.data;
  //   })
  //   .catch(err => console.log(err));

  let greeting = getGreetingFromApi(req.params.name)
                  .then(greeting =>{
                    console.log("greeting from promise", greeting);
                    myGreeting.greeting = greeting;
                    res.json(myGreeting);
                    return greeting;
                  });            
 
});


async function getGreetingFromApi(greetingName){
  const greetingUrl = "http://localhost:8081/greet/name/" + greetingName;
  let greeting = await axios.get(greetingUrl)
  .then(response => {
    //console.log(response.data);
    return response.data;
  })
  .catch(err => console.log(err));
  
  console.log("greeting from axios", greeting);
  return greeting;
}

// @route      POST api/hello/destructor
// desc        Post experience to profile
// @access     public
router.post("/destructor", (req, res) => {
  const defaultUser = {};
  const { firstName, lastName } = req.body;
  defaultUser.firstName = firstName;
  defaultUser.lastName = lastName;

  res.json(defaultUser);
});

// @route      POST api/hello/spread
// desc        Post experience to profile
// @access     public
router.post("/spread", (req, res) => {
  const defaultUser = { ...req.body };

  res.json(defaultUser);
});

module.exports = router;

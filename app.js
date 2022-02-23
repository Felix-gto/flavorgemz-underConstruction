// create a constant called express to require my express module
const express = require("express");

// create a constant called app which is going to initialize a new express app
const app = express();

//Body Parser to Parse POST Requests to the Server
const bodyParser = require("body-parser");

// require request package
const request = require("request");

// Create a constant for the HTTPS module and require it
const https = require("https");

app.use(express.static("public"));

// Grab the information that is posted to the server through an HTML FORM !!!
app.use(bodyParser.urlencoded({
  extended: true
}));

// add an app.get (what happens when the user goes to our homepage = the root route / )  inside add a response = res.send(...);
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",

      // Audience Fields and merge tags: https://us5.admin.mailchimp.com/lists/settings/merge-tags?id=515194
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/6bca62240a";

  const options = {
    method: "POST",
    auth: "felix:6ec1ceb82eca4ccb195e1cef3b7a8e8a-us5"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  // Pass the json data to the Mailchimp server + request.end to specify that we're done with the request
  request.write(jsonData);
  request.end();

});

// Success & Failure pages set up to redirect to Sign Up page when clicking button
app.post("/success", function(req, res) {
  res.redirect("/");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


// Success and Failure Pages - To see how they are displayed
app.get("/success", function(req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.get("/failure", function(req, res) {
  res.sendFile(__dirname + "/failure.html");
});


// listen() method, added the port 3000 and a anonymous callback function that will console log that our Server is running on port 3000
app.listen(process.env.PORT || 3000, function() {   // App will work both on Heroku as well as our local system (port 3000)
  console.log("Server is running on port 3000.");
});

// API Key: 6ec1ceb82eca4ccb195e1cef3b7a8e8a-us5
// List ID: 6bca62240a
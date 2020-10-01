const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

//Now all the static files will be looked into public folder
app.use(express.static("public"));



app.get("/", function(req, res) {

    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {

    console.log(req.body);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;

    // creating our data that we want to post as JSON
    const data = {
        // need key value pair 
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    // When trying to post data to some other server;
    // https.request(url,options,function(response))

    const url = "https://us2.api.mailchimp.com/3.0/lists/LIST_ID"; //get ur list ID

    const options = {
        method: "POST",
        // we need some authentication to get the successful resonse
        auth: "suryank:API_KEY" // Get your API KEY
    }

    // http.request() returns an instance of the http.ClientRequest class. The ClientRequest instance is a writable stream. If one needs to upload a file with a POST request, then write to the ClientRequest object.

    // here request will be a writeable stream;
    const request = https.request(url, options, function(response) {


        if (response.statusCode === 200) {
            // res.send("Successfully Subscribed");
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
            // res.send("Try Again");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

const port = 4000;

app.listen(process.env.PORT || port, function() {
    console.log(`Server is running on port ${port}`);
});
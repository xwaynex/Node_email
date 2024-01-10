const express = require("express");
const app = express();
const port = 5000;

// env variables
require("dotenv").config();

// path for rendering html files
const path = require("path");

// stactic files to enable css to show
app.use(express.static("view"));


//cors access to enable application on different hosts to send request
const cors = require("cors");
app.use(cors());


// for accepting json
app.use(express.json())

// for accepting post form data 
app.use(express.urlencoded({
  extended: true
}))

// nodemailer config 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
})

// testing if nodemailer success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
    console.log(success);
  }
});

app.post("/sendmail", (req, res) => {

  const {to, subject, message} = req.body;
  const mailoptions = {
    from: process.env.AUTH_EMAIL,
    to: to,
    subject: subject,
    text: message
  };

  transporter
    .sendMail(mailoptions)
    .then(() => {
      // successsful messsage
      res.sendFile(path.join(__dirname, "./view/success.html"));
    })
    .catch((error) => {
      // An error occurred
      console.log(error);
      res.json({status: "FAILED", message: "An error occured !"});
    })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./view/index.html"));
})

app.listen(port, () => {
  console.log(`server running on port ${port}`);
})
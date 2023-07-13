const express = require("express"); //
const bodyParser = require("body-parser");
const delete1 = require('./Controllers/delete1.js')
const register = require('./Controllers/registerform.js')
const signin = require('./Controllers/signinform.js')
const update1 = require('./Controllers/update.js')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cors = require("cors");
const app = express();
const knex = require("knex");
let port = 3002;
app.use(bodyParser.json());
app.use(cors());


const db = knex({
  client:'pg',
  connection:{
    host: '127.0.0.1',
    port:5432,
    user:'postgres',
    password:'kushal',
    database:'backenddb'
  }
})

const setuprequest = (imageurl) => {
  const PAT = "87512310777b47cd8d484d74af44251c";
  const USER_ID = "kushal123";
  const APP_ID = "test";
  const IMAGE_URL = imageurl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

app.post("/clari", (req, res) => {
  const { dt} = req.body;
  fetch("https://api.clarifai.com/v2/models/face-detection/outputs", setuprequest(dt))
    .then((response) => response.json())
    .then((response) => {
        res.send(response)
  
    });
});



db.select('*').from('users');

app.post('/signin',signin.handlesignin(db,bcrypt))//This is called dependency injection : use chatgpt to learn more about this

app.post('/register', register.handleregister(db,bcrypt,saltRounds))

app.put("/image", update1.updateimage(db));

app.delete("/delete", delete1.handledeleterequest(db));

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});


//the above can be also done in this way:
//app.post('/register', (req,res)=>register.handlregister(req,res,db,bcrypt,saltRounds))
//const handlrequest = (req,res,db,bcrypt,saltrounds)=>{}//here the paramaters are passed , here it should be passed according to the 
//paramters provided:

//suppose the parameters is: (db,bycrpt )
//it should be passed like this: const handlrequest = (db,bcrypt)=>now you can do anything like this: => (req, res)get the response or request:

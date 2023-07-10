const express = require("express"); //
const bodyParser = require("body-parser");
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
db.select('*').from('users');

app.post('/signin',(req,res)=>{
  const {email,password} = req.body;
  db.select('email', 'hash').from('login').where('email', '=', email)
  .then(data=>{
    console.log(data);
    if(data===[]){
     return res.json("The email and password is incorrect")
    }
    
    if(data){
      const isvalid = bcrypt.compareSync(password, data[0].hash);
    if(isvalid) {
      return db.select("*").from("users").where('email', '=', email)
      .then(user=>{
        res.json(user[0])
      })
      .catch(err => {console.log(err)});
    }
    else{
      res.status(400).json("wrong credentials")
    }  

    }
    else{
      res.json("The email and password is incorrect!!")
    }
    
  })
})


app.post('/register', (req,res)=>{
  const {email,name,password} = req.body
  if(email || password || name) {
    const hash = bcrypt.hashSync(password,saltRounds);
    db.transaction(trx=>{ 
      trx.insert({
        hash:hash,
        email:email
      })
      .into('login').returning('email')
      .then(loginemail=>{
        return trx('users').returning("*").insert({
          email:loginemail[0].email,
          name:name,
          joined:new Date()
        })
        .then(response=>res.status(200).json("success"));
  
        })
        .then(trx.commit)
        .catch(trx.rollback);
      })
      .catch(err=>res.status(400).json("unable to register"))

  }
  else{
    res.json( "The fields can't be empty")
  }
 
  })



  app.put("/image",(req,res)=>{
    const {id} = req.body
    console.log(id)
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(data=>res.json(data[0].entries))
   .catch(err=>res.status(400).json(err))
  })

  app.delete("/delete",(req,res)=>{
    const{email} = req.body;
    db.transaction(trx=> {
      return  trx('login').where ('email', '=', email).del()
      .then(()=>trx('users').where('email', '=', email).del())
      .then(response=>res.json("successfully deleted"))
      .then(trx.commit)
      .catch(trx.rollback) 
      
    })
  });
 



app.listen(port, () => {
  console.log(`Server running at ${port}`);
});




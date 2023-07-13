const handlesignin = (db,bcrypt)=>(req,res) => {
    const {email,password} = req.body;
    db.select('email', 'hash').from('login').where('email', '=', email)
    .then(data=>{
      console.log(data);
      if(data.length===0){
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
}

module.exports ={
    handlesignin:handlesignin
}
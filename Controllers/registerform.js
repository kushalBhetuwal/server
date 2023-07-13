const handleregister = (db,bcrypt,saltRounds)=>(req,res) => {
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
}

module.exports ={
    handleregister: handleregister
}
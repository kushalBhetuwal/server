const handledeleterequest =  (db)=>(req,res)=>{
        const{email} = req.body;
        db.transaction(trx=> {
          return  trx('login').where ('email', '=', email).del()
          .then(()=>trx('users').where('email', '=', email).del())
          .then(response=>res.json("successfully deleted"))
          .then(trx.commit)
          .catch(trx.rollback) 
          
        })
      }

module.exports ={
    handledeleterequest: handledeleterequest
}
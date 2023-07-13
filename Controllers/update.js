const updateimage =(db)=>(req,res)=>{
    const{id} = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(data=>res.json(data[0].entries))
   .catch(err=>res.status(400).json(err))
  }

module.exports ={
    updateimage:updateimage
}
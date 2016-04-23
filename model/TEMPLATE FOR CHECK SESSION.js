connection.query(query,function(err,rows){
  if(err){
    res.json({"message":"err.. error on checking sess quey","q":query});
  }else{
    if(rows.length>0){
      var idHost = rows[0].id_host;

    }else{
      res.json({"message":"err.. no rows on session"});
    }
  }
});

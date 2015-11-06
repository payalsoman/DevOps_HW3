var redis = require('redis')
var express = require('express')
var request = require('request')
var app = express()
var client = redis.createClient(6379, '127.0.0.1', {})
var nextServer;

client.lrange('servers',0,-1,function(err,serverVar){
    if (err) throw err
    //console.log(serverVar);
    //console.log(serverVar.length);
    if(serverVar.length==0){
      client.rpush(['servers', 3000,3001], function(err, reply) {
          console.log("added servers"+reply); //prints 2
      });
    }
})


var server = app.listen(3002, function () {

    var host = server.address().address
    var port = server.address().port    
    console.log('Example app listening at http://%s:%s', host, port)
})

app.get('/', function(req, res) {

  
  client.rpoplpush('servers', 'servers', function(err, reply) {
      //console.log("rpoplpush servers"); //prints 2      
  });
  
  client.lrange('servers',0,0,function(err,serverVar){
    if (err) throw err
    nextServer = serverVar;
    //console.log("nextServer is "+nextServer)
  })
  
  console.log("transferring request to "+ nextServer);
  request('http://0.0.0.0:'+nextServer+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) 
    }
  })

})



app.get('/get',function(req,res){

  client.rpoplpush('servers', 'servers', function(err, reply) {
      //console.log("rpoplpush servers"); //prints 2      
  });
  
  client.lrange('servers',0,0,function(err,serverVar){
    if (err) throw err
    nextServer = serverVar;
    //console.log("nextServer is "+nextServer)
  })
  
  console.log("transferring request to "+ nextServer);
  request('http://0.0.0.0:'+nextServer+'/get', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) 
    }
  }) 
})


app.get('/set',function(req,res){

  client.rpoplpush('servers', 'servers', function(err, reply) {
      //console.log("rpoplpush servers"); //prints 2      
  });
  
  client.lrange('servers',0,0,function(err,serverVar){
    if (err) throw err
    nextServer = serverVar;
    //console.log("nextServer is "+nextServer)
  })
  
  console.log("transferring request to "+ nextServer);
  request('http://0.0.0.0:'+nextServer+'/set', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) 
    }
  }) 
})


app.get('/upload',function(req,res){
  client.rpoplpush('servers', 'servers', function(err, reply) {
      //console.log("rpoplpush servers"); //prints 2      
  });
  
  client.lrange('servers',0,0,function(err,serverVar){
    if (err) throw err
    nextServer = serverVar;
    //console.log("nextServer is "+nextServer)
  })
  
  console.log("transferring request to "+ nextServer);
  request('http://0.0.0.0:'+nextServer+'/upload', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) 
    }
  }) 
})

app.get('/meow',function(req,res){
  client.rpoplpush('servers', 'servers', function(err, reply) {
      //console.log("rpoplpush servers"); //prints 2      
  });
  
  client.lrange('servers',0,0,function(err,serverVar){
    if (err) throw err
    nextServer = serverVar;
    //console.log("nextServer is "+nextServer)
  })
  
  console.log("transferring request to "+ nextServer);
  request('http://0.0.0.0:'+nextServer+'/meow', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) 
    }
  }) 
})

app.get('/recent',function(req,res){
  client.rpoplpush('servers', 'servers', function(err, reply) {
      //console.log("rpoplpush servers"); //prints 2      
  });
  
  client.lrange('servers',0,0,function(err,serverVar){
    if (err) throw err
    nextServer = serverVar;
    //console.log("nextServer is "+nextServer)
  })
  
  console.log("transferring request to "+ nextServer);
  request('http://0.0.0.0:'+nextServer+'/recent', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body) 
    }
  }) 
})

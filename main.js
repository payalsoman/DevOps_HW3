var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
//REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
    console.log(req.method, req.url);
    var addUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    
client.lpush('urlQueue', addUrl, function(err, reply){ 
console.log(reply); 
});

client.ltrim('urlQueue',0,4, function(err, reply){ 
console.log(reply); 
});

    next(); // Passing the request to the next handler in the stack.
});

app.get('/recent', function(req, res) {
  client.lrange('urlQueue', 0,-1, function(err, reply){ 
console.log(reply); 
res.send(reply);
});
})

app.get('/set', function(req, res) {
  client.set("key", "message only for 10 seconds");
  client.expire("key", 10);
  res.send("Key Value is now set for 10 seconds");
})

app.get('/get', function(req, res) {
  client.get("key", function(err,value){ res.send(value)});
})


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
       fs.readFile( req.files.image.path, function (err, data) {
            if (err) throw err;
            var img = new Buffer(data).toString('base64');
            console.log(img);
            client.lpush('imageUpload',img,function(err, reply){ 
            console.log(reply); 
    });
        });
 }

    res.status(204).end()
}]);

app.get('/meow', function(req, res) {
    
        
        

        client.lpop("imageUpload",function(err, value){ 
            if (err) throw err;
            console.log(value);
            res.writeHead(200, {'content-type':'text/html'});
        res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+value+"'/>");
        res.end();
        res.send();
    });
    
    
 });



app.get('/', function(req, res) {
  res.send('hello world')
})

//HTTP SERVER
 var server = app.listen(3000, function () {

  var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })

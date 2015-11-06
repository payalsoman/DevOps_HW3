var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    var url_full = req.protocol + '://' + req.get('host') + req.originalUrl;
    client.lpush("urlvisitedlist", url_full, function(err, reply) {
        client.ltrim("urlvisitedlist", 0, 4);
    });

    next(); // Passing the request to the next handler in the stack.
});


app.get('/', function(req, res) {
  res.send('hello world')
})

app.get('/set', function(req, res) {
    client.set("setkey", "this message will self-destruct in 10 seconds")
    client.expire("setKey", 10)
    res.send("Your key is set!!!")
})
app.get('/get', function(req, res) {
    client.get("setkey", function(err, value) {
        res.send(value)
    });
})


app.get('/recent', function(req, res) {
    client.lrange("urlvisitedlist", 0, -1, function(err, urls) {
        res.send(urls);
    });
});


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		console.log(img);
			client.lpush('imagelist', img);
 		});
 	}

    res.status(204).end()
 }]);

 app.get('/meow',function(req, res) {
    client.lpop("imagelist", function(err, img) {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("<h1>\n<img src='data:my_pic.jpg;base64," + img + "'/>");
        res.end();
    });
});

// HTTP SERVER
 var server = app.listen(3001, function () {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })


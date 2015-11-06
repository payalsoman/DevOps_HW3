# DevOps_HW3


Install redis
``` 
wget http://download.redis.io/releases/redis-2.8.19.tar.gz 
tar xzf redis-2.8.19.tar.gz
cd redis-2.8.19
make
make test
sudo make install
```

Install express
``` npm install express --save```

Run redis
``` redis-server ```

### A simple web server

Creating a simple web server using express
```
var server = app.listen(3000, function () {
	
	  var host = server.address().address
	  var port = server.address().port
	
	  console.log('Example app listening at http://%s:%s', host, port)
	})
```
#### Complete set/get

We set the value of variable setkey and can get the value.
Go to localhost:3000/set will set the variable and localhost:3000/get will allow us to get its value.

```
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

```

#### Complete recent

We can get the recently visited urls by adding the follwing code snippet. We use the lpush, ltrim and lrange redis commands to store the most recent 5 sites visited.
```
app.use(function(req, res, next) {
    console.log(req.method, req.url);
    var url_full = req.protocol + '://' + req.get('host') + req.originalUrl;
    client.lpush("urlvisitedlist", url_full, function(err, reply) {
        client.ltrim("urlvisitedlist", 0, 4);
    });

    next(); // Passing the request to the next handler in the stack.
});

app.get('/recent', function(req, res) {
    client.lrange("urlvisitedlist", 0, -1, function(err, urls) {
        res.send(urls);
    });
});
```

#### Complete upload/meow

The `/upload` is the upload stub. We push the uploaded image to the list imagelist.
```
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
```

We use curl to upload an image easily.
```
	curl -F "image=@./img/morning.jpg" localhost:3000/upload
```

The `meow` stub allows us to display the uploaded image. The lpop pops the last uploaded image.  
```
app.get('/meow',function(req, res) {
    client.lpop("imagelist", function(err, img) {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("<h1>\n<img src='data:my_pic.jpg;base64," + img + "'/>");
        res.end();
    });
});
```

#### Additional Instance and Proxy Server

The file proxyserver.js runs the server on port 3000 once and then on port 3001 and alternates so on.
```
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
```

#### Screencast:

https://github.com/payalsoman/DevOps_HW3/blob/master/hw3_payal.gif


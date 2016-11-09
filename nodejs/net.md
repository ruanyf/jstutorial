---
title: Net模块和DNS模块
layout: page
category: nodejs
date: 2015-03-17
modifiedOn: 2015-03-17
---

`net`模块用于底层的网络通信。

下面是一段简单的监听2000端口的代码。

```javascript
var net = require('net');
var server = net.createServer();
server.listen(2000, function () { console.log('Listening on port 2000'); });
server.on('connection', function (stream) {
  console.log('Accepting connection from', stream.remoteAddress);
  stream.on('data', function (data) { stream.write(data); });
  stream.on('end', function (data) { console.log('Connection closed'); });
});
```

## isIP()

`isIP`方法用于判断某个字符串是否为IP地址。

```javascript
require('net').isIP('10.0.0.1') // 4
require('net').isIP('cats') // 0
```

## 服务器端Socket接口

来看一个简单的Telnet服务的[例子](https://gist.github.com/atdt/4037228)。

```javascript
var net = require('net');
var port = 1081;
var logo = fs.readFileSync('logo.txt');
var ps1 = '\n\n>>> ';

net.createServer( function ( socket ) {
  socket.write( logo );
  socket.write( ps1 );
  socket.on( 'data', recv.bind( null, socket ) );
} ).listen( port );
```

上面代码，在1081端口架设了一个服务。可以用telnet访问这个服务。

```bash
$ telnet localhost 1081
```

一旦telnet连入以后，就会显示提示符`>>>`，输入命令以后，就会调用回调函数`recv`。

```javascript
function recv( socket, data ) {
  if ( data === 'quit' ) {
    socket.end( 'Bye!\n' );
    return;
  }

  request( { uri: baseUrl + data }, function ( error, response, body ) {
    if ( body && body.length ) {
      $ = cheerio.load( body );
      socket.write( $( '#mw-content-text p' ).first().text() + '\n' );
    } else {
      socket.write( 'Error: ' + response.statusCode );
    }
    socket.write( ps1 );
  } );
}
```

上面代码中，如果输入的命令是`quit`，然后就退出telnet。如果是其他命令，就发起远程请求读取数据，并显示在屏幕上。

下面代码是另一个例子，用到了更多的接口。

```javascript
var serverPort = 9099;
var net = require('net');
var server = net.createServer(function(client) {
  console.log('client connected');
  console.log('client IP Address: ' + client.remoteAddress);
  console.log('is IPv6: ' + net.isIPv6(client.remoteAddress));
  console.log('total server connections: ' + server.connections);

  // Waiting for data from the client.
  client.on('data', function(data) {
    console.log('received data: ' + data.toString());

    // Write data to the client socket.
    client.write('hello from server');
  });

  // Closed socket event from the client.
  client.on('end', function() {
    console.log('client disconnected');
  });
});

server.on('error',function(err){
  console.log(err);
  server.close();
});

server.listen(serverPort, function() {
  console.log('server started on port ' + serverPort);
});
```

上面代码中，createServer方法建立了一个服务端，一旦收到客户端发送的数据，就发出回应，同时还监听客户端是否中断通信。最后，listen方法打开服务端。

## 客户端Socket接口

客户端Socket接口用来向服务器发送数据。

```javascript
var serverPort = 9099;
var server = 'localhost';
var net = require('net');

console.log('connecting to server...');
var client = net.connect({server:server,port:serverPort},function(){
  console.log('client connected');

  // send data
  console.log('send data to server');
  client.write('greeting from client socket');
});

client.on('data', function(data) {
  console.log('received data: ' + data.toString());
  client.end();
});

client.on('error',function(err){
  console.log(err);
});
client.on('end', function() {
  console.log('client disconnected');
});

```

上面代码连接服务器之后，就向服务器发送数据，然后监听服务器返回的数据。

## DNS模块

DNS模块用于解析域名。resolve4方法用于IPv4环境，resolve6方法用于IPv6环境，lookup方法在以上两种环境都可以使用，返回IP地址（address）和当前环境（IPv4或IPv6）。

```javascript
var dns = require('dns');

dns.resolve4('www.pecollege.net', function (err, addresses) {
  if (err)
    console.log(err);

  console.log('addresses: ' + JSON.stringify(addresses));
});

dns.lookup('www.pecollege.net', function (err, address, family) {
  if (err)
    console.log(err);

  console.log('addresses: ' + JSON.stringify(address));
  console.log('family: ' + JSON.stringify(family));
});
```

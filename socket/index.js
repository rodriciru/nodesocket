var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var url = process.env.URL || "nodesocket.local";
var mysql      = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'obssocket'
});

db.connect();
//db.end();


/*
var dsn = {
  host: 'localhost',
  user: 'root',
  password: '',
};
*/


//wamp64 -> bin -> mariadb( o mysql depende) -> carpeta de la version -> my.ini
/*
log-bin=mysql-bin

; binary logging format - mixed recommended
binlog_format=row

; required unique id between 1 and 2^32 - 1
; defaults to 1 if master-host is not set
; but will not function as a master if omitted
server-id = 1
;# Optional, purge old logs
expire_logs_days = 10
; Optional, limit log size
max_binlog_size  = 100M
*/
var mysqlevents = new MySQLEvents(db, {});
mysqlevents.start()
  .then(() => console.log('I\'m running!'))
  .catch(err => console.error('Something bad happened', err));
mysqlevents.addTrigger({
  name: 'imagenes',
  expression: 'obssocket.imagenes',
  statement: MySQLEvents.STATEMENTS.ALL,
  onEvent: (event) => { // You will receive the events here
    getAllImages()
    .then(function(result){
        io.emit('new message', result);
    })
    .catch(function(err){
      console.log("Promise rejection error: "+err);
    })
  },
});
mysqlevents.addTrigger({
  name: 'settings',
  expression: 'obssocket.settings',
  statement: MySQLEvents.STATEMENTS.ALL,
  onEvent: (event) => { // You will receive the events here
    getAllSettings()
    .then(function(result){
        io.emit('new settings', result);
    })
    .catch(function(err){
      console.log("Promise rejection error: "+err);
    })
  },
});

mysqlevents.on(MySQLEvents.EVENTS.CONNECTION_ERROR, (err) => console.log('Connection error', err));
mysqlevents.on(MySQLEvents.EVENTS.ZONGJI_ERROR, (err) => console.log('ZongJi error', err));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/socket.html');
});

io.on('connection', function(socket) {
  /*io.emit('new message', '{\"ok\":1,\"msg\":[{\"id\":\"1\",\"url\":\"big_bunny_fake - copia.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"2\",\"url\":\"big_bunny_fake.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"3\",\"url\":\"bridge - copia.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"4\",\"url\":\"bridge.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"5\",\"url\":\"leaf - copia.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"6\",\"url\":\"leaf.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"7\",\"url\":\"shelter - copia (3).jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"8\",\"url\":\"shelter - copia.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"9\",\"url\":\"shelter.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"10\",\"url\":\"tree - copia.jpg\",\"activo\":\"1\",\"posicion\":\"0\"},{\"id\":\"11\",\"url\":\"tree.jpg\",\"activo\":\"1\",\"posicion\":\"0\"}]}');*/
  getAllSettings()
  .then(function(result){
    //console.log(result);
      io.emit('new settings', result);
  })
  .catch(function(err){
    console.log("Promise rejection error: "+err);
  });

  getAllImages()
  .then(function(result){
      io.emit('new message', result);
  })
  .catch(function(err){
    console.log("Promise rejection error: "+err);
  });
  /*getAllImages(function(result){
    io.emit('new message', result);
  });*/

  console.log('connection');
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

/*http.listen(port, url, function() {
  console.log('listening on ' + url + ':' + port);
});*/
http.listen(port, function() {
  console.log('listening on *:' + port);
});

/*function getAllImages(callback){
  db.query('SELECT * from imagenes', function (error, results, fields) {
    if (error) throw error;
    return callback(JSON.stringify(results));
  });
}*/
getAllImages = function(){
  return new Promise(function(resolve, reject){
    db.query(
        "SELECT * from imagenes WHERE activo = 1 ORDER BY posicion",
        function(error, results, fields){
            if(results === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
                resolve(JSON.stringify(results));
            }
        }
    )}
)};

getAllSettings = function(){
  return new Promise(function(resolve, reject){
    db.query(
        "SELECT * from settings",
        function(error, results, fields){
            if(results === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
              var obj_a = {};
              results.forEach(function(val, i) {
                  obj_a[val.nombre] = results[i];
              });
                resolve(JSON.stringify(obj_a));
            }
        }
    )}
)};

var express = require('express');
var app = express();
var cors = require('cors')
var path = require('path');
var http = require('http').Server(app);
var port = process.env.PORT || 3001;
var url = process.env.URL || "controller.manager.nodesocket.local";
var mysql = require('mysql');
var fs = require('fs');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'obssocket'
});
const images_dir = "../imagenes";

db.connect();
//db.end();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/updateImagesDbFromDir', function(req, res) {
  updateImagesDbFromDir()
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});
app.get('/getAllImages', function(req, res) {
  getAllImages()
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});
app.get('/deleteImage/:id/:url', function(req, res) {
  deleteImage(req.params.id, req.params.url)
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});

http.listen(port, url, function() {
  console.log('manager Controller listening on ' + url + ':' + port);
});

/*function getAllImages(callback){
  db.query('SELECT * from imagenes', function (error, results, fields) {
    if (error) throw error;
    return callback(JSON.stringify(results));
  });
}*/
updateImagesDbFromDir = function() {
  return new Promise(function(resolve, reject) {
    let sql = "INSERT IGNORE INTO `imagenes` VALUES";
    let sql2 = "DELETE FROM `imagenes` WHERE `url` NOT IN (";
    fs.readdir(images_dir, function(err, items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i] === '.gitignore') {
          continue;
        }
        sql += " (null,'" + items[i] + "',1,0),";
        sql2 += "'" + items[i] + "',";
      }
      sql = sql.substring(0, sql.length - 1);
      sql += ";";
      sql2 = sql2.substring(0, sql2.length - 1);
      sql2 += ");";
      db.query(
        sql,
        function(error, results, fields) {
          if (results === undefined) {
            reject(new Error(error));
          } else {
            db.query(
              sql2,
              function(error, results, fields) {
                if (results === undefined) {
                  reject(new Error(error));
                } else {
                  resolve(results);
                }
              }
            )
          }
        }
      )
    });
  })
};

getAllImages = function() {
  let sql = "SELECT * FROM `imagenes` ORDER BY posicion";
  return new Promise(function(resolve, reject) {
    db.query(
      sql,
      function(error, results, fields) {
        if (results === undefined) {
          reject(new Error(error));
        } else {
          resolve(results);
        }
      }
    );
  });
}

deleteImage = function(id,url) {
  let sql = `DELETE FROM imagenes WHERE id = ${id}`;
  return new Promise(function(resolve, reject) {
    db.query(
      sql,
      function(error, results, fields) {
        if (results === undefined) {
          reject(new Error(error));
        } else {
          fs.unlink(images_dir + '/' + url, function (err) {
              if (err){
                 reject(new Error(err));
               }else{
                resolve(results);
              }
          });
        }
      }
    );
  });
}

logResultado = function(status, msg, forceJSON = false) {
  let arr = {
    "ok": status,
    "msg": msg
  };
  if (forceJSON) { // res.json ya hace el stringify así que no es necesario
    return JSON.stringify(arr);
  } else {
    return arr;
  }
};

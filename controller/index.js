var express = require('express');
var app = express();
var cors = require('cors')
var path = require('path');
var multer = require('multer');
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
let maxFileSize = 3 * 1000000;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, images_dir);
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Solo imagenes!';
    return cb(new Error('Solo imagenes!'), false); // si envias un error la ejecución se para de golpe. Si envías null simplemente salta ese file.
  }

  fs.access(images_dir + '/' + file.originalname, fs.F_OK, (err) => {
    if (err) {} else {
      //file exists
      req.fileValidationError = 'Ya existe una imagen con ese nombre!';
      return cb(null, false);
    }
  });
  cb(null, true);
};


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

app.get('/setPosicion/:id/:posicion', function(req, res) {
  setPosicion(req.params.id, req.params.posicion)
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});

app.get('/setActivo/:id/:activo', function(req, res) {
  setActivo(req.params.id, parseInt(req.params.activo))
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});

app.get('/getOpcion/:nombre', function(req, res) {
  getOpcion(req.params.nombre)
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});

app.get('/getAllOpciones/', function(req, res) {
  getAllOpciones()
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});

app.get('/setOpcion/:id/:valor', function(req, res) {
  setOpcion(req.params.id, parseInt(req.params.valor))
    .then(function(result) {
      res.json(logResultado(1, result))
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
});

app.post('/addImagen', async function(req, res) {
  await getOpcion('maxFileSize')
    .then(function(result) {
      maxFileSize = result[0].valor * 1000000;
    })
    .catch(function(err) {
      console.log(logResultado(0, err));
    })
  var limits = {
    fileSize: maxFileSize
  }
  let upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: limits
  }).single('file');

  upload(req, res, function(err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
      return res.status(422).json({
        error: req.fileValidationError
      });
    } else if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(422).json({
          error: `La imagen es muy grande el maximo es ${maxFileSize / 1000000}MB`
        });
      }
      return res.status(422).json({
        error: err
      });
    } else if (!req.file) {
      return res.status(422).json({
        error: 'Please select an image to upload'
      });
    } else if (err) {
      return res.status(422).json({
        error: err
      });
    }
    addImagenToDB(req.file.originalname)
      .then(function(result) {
        // Display uploaded image for user validation
        return res.status(200).json(logResultado(1, result));
      })
      .catch(function(err) {
        console.log(logResultado(0, err));
      });
  });
});

http.listen(port, url, function() {
  console.log('manager Controller listening on ' + url + ':' + port);
});

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

addImagenToDB = function(url) {
  let sql = `INSERT IGNORE INTO imagenes VALUES (null,'${url}',1,0);`;
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

setActivo = function(id, activo) {
  let sql = `UPDATE imagenes SET activo = ${(activo && (Number.isInteger(activo) || typeof activo === "boolean") ? 1 : 0)} WHERE imagenes.id = ${id};`;
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

deleteImage = function(id, url) {
  let sql = `DELETE FROM imagenes WHERE id = ${id}`;
  return new Promise(function(resolve, reject) {
    db.query(
      sql,
      function(error, results, fields) {
        if (results === undefined) {
          reject(new Error(error));
        } else {
          fs.unlink(images_dir + '/' + url, function(err) {
            if (err) {
              reject(new Error(err));
            } else {
              resolve(results);
            }
          });
        }
      }
    );
  });
}

getAllOpciones = function() {
  let sql = `SELECT * FROM settings`;
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

getOpcion = function(nombre) {
  let sql = `SELECT * FROM settings WHERE nombre = '${nombre}'`;
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

setOpcion = function(id, valor) {
  let sql = `UPDATE settings SET valor = ${valor} WHERE id = ${id}; `;
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

setPosicion = function(id, posicion) {
  let sql = `UPDATE imagenes SET posicion = ${posicion} WHERE imagenes.id = ${id}; `;

  return new Promise(function(resolve, reject) {
    db.query(
      sql,
      function(error, results, fields) {
        if (results === undefined) {
          reject(new Error(error));
        } else {
          sql = `SELECT id,posicion FROM imagenes AS img WHERE img.id != ${id} ORDER BY posicion;`;
          db.query(
            sql,
            function(error, results, fields) {
              if (results === undefined) {
                reject(new Error(error));
              } else {
                sql = `UPDATE imagenes SET posicion = (CASE`;
                let newPos = 0;
                for (var i = 0; i < results.length; i++) {
                  if (newPos == posicion) newPos++;
                  sql += ` WHEN id = ${results[i]["id"]} THEN ${newPos}`;
                  newPos++;
                }
                sql += " END) WHERE  id IN (";
                for (var i = 0; i < results.length; i++) {
                  sql += results[i]["id"] + ",";
                }
                sql = sql.substring(0, sql.length - 1);
                sql += ");";
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
              }
            }
          );
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

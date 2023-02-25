var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs')
var os = require('os')
var bodyParser = require('body-parser');
var { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config()
const conn = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//const storage = new GridFsStorage({db: conn});
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, os.tmpdir());
    },
    filename: function(req, file, callback){
        callback(null, file.originalname)
    }
});
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 2);
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const singleUpload = multer({ storage:storage }).single('upfile');
app.post('/api/fileanalyse', singleUpload, (req, res) => {
  console.log(req.file.originalname);
  return res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});

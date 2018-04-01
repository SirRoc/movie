var path = require("path");
var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var multipart = require("connect-multiparty")();
var MongoStore = require("connect-mongo")(session);
var routes = require('./config/routes');
var fs = require('fs');
var User = require("./app/models/user");

var port = process.env.PORT || 3000;
var  dbUrl = 'mongodb://127.0.0.1:27017/movie';
mongoose.connect(dbUrl);

var app = express();
app.set("views", "./app/views/pages");
app.set("view engine", "jade");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(
  session({
    secret: "foo",
    store: new MongoStore({
      url: dbUrl,
      collection: "sessions"
    })
  })
); 
app.use(express.static(path.join(__dirname, "public")));
app.use(multipart); // 多种数据类型

app.listen(port);

routes(app);



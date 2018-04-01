var User = require("../models/user");
var config = {
  user: 'admin',
  password: 'admin',
  role: 51
}


exports.init = function(req, res, next) {
  if(!User.find({role: config.role > 50})) {
    var _user = new User(config);
    
    user.save(function(err, user) {
      if(err) throw err;

      res.redirect('/')
    });
  }
  else {
    next()
  }

}

// signup
exports.signup = function(req, res, next) {
  var _user = req.body.user;

  var user = new User(_user);
  user.save(function(err, user) {
    if (err) {
      console.log(err);
    }
    res.redirect("/user/list");
  });
};

exports.signinPage = function(req, res) {
  res.render("signin.jade", {
    title: "登陆页面"
  });
};

exports.signupPage = function(req, res) {
  res.render("signup.jade", {
    title: "注册页面"
  });
};

// user list
exports.list = function(req, res) {
    User.fetch(function(err, users) {
      if (err) {
        console.log(err);
      }
      res.render("userlist.jade", {
        title: "用户 列表页",
        users: users
      });
    });
};

// signin
exports.signin = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({ name: name }, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.redirect("/signin");
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log(err);
      }

      if (isMatch) {
        // 登陆成功，保存会话状态。
        req.session.user = user;

        return res.redirect("/");
      } else {
        console.log("password is not isMatch");
      }
    });
  });
};

// logout
exports.logout = function(req, res) {
  // 删除用户
  delete req.session.user;

  res.redirect("/signin");
};


// signin class
exports.signinRequest = function(req, res, next) {
    var _user = req.session.user;
    console.log(_user);
    if(!_user) {
        return res.redirect('/signin');
    }
    next();
};

// admin class
exports.adminRequest = function(req, res, next) {
  var _user = req.session.user;
  console.log("admin:", _user);
  if (_user.role <= 50) {
    return res.redirect('/');
  }
  next();
};
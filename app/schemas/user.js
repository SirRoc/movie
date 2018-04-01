var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var saltRounds = 10;    

var UserSchema = new mongoose.Schema({
  name: {
      unique: true,
      type: String
  },
  password: String,
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      dafault: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});


// middleware 
UserSchema.pre("save", function(next) {
  var user = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
     });
   });

});

// 实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    var self = this;
    bcrypt.compare(_password, self.password, function(err, isMatch) {
      if(err) return cb(err);
      // 校验成功回调
      cb(null, isMatch);
    });
  }
};

// 静态方法
UserSchema.statics = {
  fetch: function(cb) {
    return this.find({})
      .sort("meta.updateAt")
      .exec(cb);
  },
  findById: function(id, cb) {
    return this.findOne({ _id: id }).exec(cb);
  }
};

module.exports = UserSchema;

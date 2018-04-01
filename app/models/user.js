var mongoose = require("mongoose");
var UserSchema = require("../schemas/user");
var User = mongoose.model("User", UserSchema);
// user2为mongodb表名
module.exports = User;

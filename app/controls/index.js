var Movie = require("../models/movie");
var Category = require("../models/category");
// index page
exports.index = function(req, res) {
  // 首页电影分类显示个数
  var movieShowCount = 6;
  Category.find({}) // 遍历所有电影分类， 我怎么知道这两个有关联呢？ 必须从存储下手。
    .populate({ path: "movies", options: { limit: movieShowCount } }) // 关联movies
    .exec(function(err, categories) {
      if (err) {
        console.log(err);
      }

      res.render("index.jade", { title: "电影主页", categories: categories });
    });
};

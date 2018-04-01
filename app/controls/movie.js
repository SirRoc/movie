var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// admin update movie
exports.update = function(req, res) {
  var id = req.params.id;
  var movieObj = req.body.movie;

  if(id) {
    Movie.find({_id: id}, function(err, movie) {
      if(err) throw err;

      res.render("admin.jade", {
        title: "更新电影页面",
        movie: movie
      });
    });
  }
};

//admin movie
exports.new =  function(req, res) {
  Category.find({}, function(err, categories) {
    res.render('admin.jade', { 
      title: "电影录入", 
      categories: categories,
      movie: {}
    });
  });

};

// admin poster
exports.uploadPoster = function(req, res, next) {
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFilename = posterData.originalFilename;
console.log(posterData)
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now();
      var type = posterData.type.split("/")[1];
      var poster = timestamp + "." + type;
      var newPath = path.join(__dirname, "../../", "/public/upload/" + poster);

      fs.writeFile(newPath, data, function(err) {
        req.poster = poster;
        next();
      });
    });
  } else {
    next();
  }
}

//admin post movie
exports.save =  function(req, res) {
  var movieObj = req.body.movie;
  var id = movieObj._id;
  var _movie;

  if(req.poster) {
    movieObj.poster = req.poster;
  }

  if (id) {
    Movie
      .where({_id: id})
      .update({$set: movieObj})
      .exec(function(err, movie) {
        if(err) throw err;

        res.redirect("/movie/" + movie._id);
      })
    // Movie.findById(id, function(err, movie) {
    //   if (err) {
    //     console.log(err);
    //   }

    //   _movie = _.extend(movie, movieObj);
    //   _movie.save(function(err, movie) {
    //     if (err) {
    //       console.log(err);
    //     }

    //     res.redirect("/movie/" + movie._id);
    //   });
    // });
  } else {
    console.log("========================2");
    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    _movie = new Movie(movieObj);
    _movie.save(function(err, movie) {
      if (err) console.log(err);

      if (movieObj.category) {
        // 如果分类选择有值的话，那就存分类选择，
        Category.findById(categoryId, function(err, category) {
          if (err) console.log(err);

          category.movies.push(movie._id);
          category.save(function(err, category) {
            if (err) {
              console.log(err);
            }

            res.redirect("/movie/" + movie._id);
          });
        });
      } else if (categoryName) {
        // 否则如果分类名有值的话，就存分类值。
        var _categoryName = new Category({
          name: categoryName,
          movies: movie._id
        });
        _categoryName.save(function(err, categoryName) {
          if (err) throw err;

          res.redirect("/movie/" + movie._id);
        });
      }
    });
  }
};

// list page
exports.list = function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }
    res.render("list.jade", {
      title: "爱电影 列表页",
      movies: movies
    });
  });
};

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
// PV总计
  Movie.update({_id: id},{$inc: {PV: 1}}, function(err) {
    if(err) throw err;
  })

  Movie.findById(id, function(err, movie) {
    // 查找当前电影的评价
      Comment
      .find({movie: id})
      .populate('from', 'name')  // populate，from的名字。
      .populate('reply.from reply.to', 'name')
      .exec( 
        function(err, comments) {
        if (err) {
          console.log(err);
        }
        console.log(comments);
        res.render("detail.jade", {
          title: "爱电影 ",
          movie: movie,
          comments: comments
        });
      });
  });
};

//list delete movie
exports.delete = function(req, res) {
  var id = req.query.id;

  if (id) {
    Movie.remove({ _id: id }, function(err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({ success: 1 });
      }
    });
  }
  
};



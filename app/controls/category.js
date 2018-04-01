var mongoose = require('mongoose');
var Category = require('../models/category');
var Movie = require('../models/movie');

exports.new = function(req, res) {
    res.render('category_admin.jade', {
      title: '后台分类录入页',
      category: {
        name: ''
      } 
    });
};

exports.save = function(req, res) {
  var categoryObj = req.body.category;
  
  var category = new Category(categoryObj);
  category.save(function(err, category) {
    res.redirect('/category/list');
  });
};

exports.list = function(req, res) {
  Category.find({}, function(err, categories) {
    if(err) return console.log(err);

    res.render("categorylist.jade", {
      title: '用户分类列表',
      categories: categories
    
    });
  });
}

exports.delete = function(req, res) {
  var id = req.query.id;

  if (id) {
    Category.remove({ _id: id }, function(err, category) {
      if (err) {
        console.log(err);
      } 
      else {
        res.json({ success: 1 });
      }
    });
  }
};

exports.search = function(req, res) {
  // 每页渲染电影数
  var count = 2;
  var categoryId = req.query.id;
  var pageId = (req.query.page - 1) * count || 0;
  var searchContent = req.query.searchContent;

  if (categoryId) {

    Category.findById({ _id: categoryId })
      .populate({ path: "movies" })
      .exec(function(err, categories) {
        var movies = categories.movies;
        var movieCount = movies.length;
        var pageMoviesCount = movies.slice(pageId, pageId + count);
        // 索引
        var PageIndex = Math.ceil(movieCount / count);
        res.render("categorySearch.jade", {
          title: "分类渲染",
          categories: categories,
          pageMovies: pageMoviesCount,
          PageIndex: PageIndex
        });
      });
  }
  else if (searchContent) {

    Movie.find({ title: new RegExp(searchContent + '.*', 'i') }, function(err,movie) {
      if(err) throw err;

      res.render("categorySearch.jade", {
        title: "分类查询页",
        searchContent: searchContent,
        pageMovies: movie
      });
    });
  }
};
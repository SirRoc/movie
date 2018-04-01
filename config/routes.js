var Index = require("../app/controls/Index");
var movie = require("../app/controls/movie");
var user = require("../app/controls/user");
var comment = require("../app/controls/comment");
var category = require("../app/controls/category");

module.exports = function(app) {

    // pre handle user
    app.use(function(req, res, next) {
        var _user = req.session.user;
        if(_user) {
            // 有用户就赋值
            app.locals.user = _user;
        }
        else {
            // 没用户就删除本地缓存。
            delete app.locals.user;
        }
        next();
    });

    // Index page
    app.get("/", user.init, Index.index);

    // user
    app.post("/user/signup", user.signup);
    app.get("/user/list", user.signinRequest, user.adminRequest, user.list);
    app.post("/user/signin", user.signin);
    app.get("/logout", user.logout);
    app.get("/signin", user.signinPage);
    app.get("/signup", user.signupPage);

    // movie
    app.get("/movie/:id", movie.detail);
    app.get("/admin/movie/new", user.signinRequest, user.adminRequest, movie.new);
    app.get("/admin/update/:id", user.signinRequest, user.adminRequest, movie.update);
    app.post("/admin/movie", user.signinRequest, user.adminRequest, movie.uploadPoster, movie.save);
    app.get("/admin/list", user.signinRequest, user.adminRequest, movie.list);
    app.delete("/admin/list", user.signinRequest, user.adminRequest, movie.delete);

    // comment
    app.post("/user/comment", user.signinRequest, comment.save);

    // category
    app.get("/admin/category/new", user.signinRequest, user.adminRequest, category.new);
    app.post("/admin/category", user.signinRequest, user.adminRequest, category.save);
    app.get("/category/list", user.signinRequest, user.adminRequest, category.list);
    app.delete("/category/list", user.signinRequest, user.adminRequest, category.delete);

    // 分类查询
    app.get("/categorySearch", category.search);
};

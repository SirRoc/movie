$(function() {
    // 电影录入页面
    $('#movieEnter').click(function() {
        window.open("/admin/movie/new");
    });
    // 电影列表
    $('#movieList').click(function() {
        window.open('/admin/list');
    });

    // 分类录入
    $('#categoryEnter').click(function() {
        window.open('/admin/category/new');
    });
    $('#categoryList').click(function() {
        window.open("/category/list");
    });


    // 分类录入
    $('#addCategory').click(function() {
        window.open("/admin/category/new");
    })
})
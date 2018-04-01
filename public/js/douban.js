$(function() {
    

    // 点击后无值处理
    $("#doubanVal").val('请输入豆瓣电影ID');
    $("#doubanVal").click(function(e) {
        var self = $(this);
        self.val('')
    });

    // jsonp跨域请求
    $('#douban').click(function(e) {
        var serachParams = $('#doubanVal').val();
        $.ajax({
          url: "https://api.douban.com/v2/movie/" + serachParams,
          dataType: 'jsonp',
          success: function(data) {
            $("#inputTitle").val(data.title);
            $("#inputDoctor").val(data.author[0].name);
            $("#inputLanguage").val(data.tags[5].name);
            $("#inputposter").val(data.image);
            $("#inputcountry").val(data.tags[1].name);
            $("#inputflash").val(data.image)
            $("#inputsummary").val(data.summary);
          },
          error: function(err) {
            $("#doubanVal").val('资源加载错误，请重新加载！');
            $("#doubanVal").click(function(e) {
                var self = $(this);
                self.val('');
            });
          }
        });

    })
});
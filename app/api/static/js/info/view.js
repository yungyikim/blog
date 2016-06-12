
var app = angular.module('myapp', ['ngRoute', 'ngCookies']);
app.config(function($httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
});
app.controller('MainCtrl', ['$scope', '$http', '$sce', '$cookies', function($scope, $http, $sce, $cookies) {
    $scope.user = {
        id: $('#user-info').attr('data-id')
    };
    $scope.article = {
        id: $('article').attr('data-id'),
        title: $('#title').text(),
        content: $('#source')[0].outerText
    };

    $(".ui.sidebar")
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events','.launch');

    $('.following.bar').addClass('light');
    $('.following.bar .menu.inverted').removeClass('inverted');
    $('.menu .item').tab();

    $('.ui.form').form({
        fields: {
          content: {
            identifier: 'content',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter a content'
              }
            ]
          }
        },
        onSuccess: function(event, fields) {
            var postData =
                JSON.stringify({
                    board: $('article').attr('data-board-id'),
                    category: $('article').attr('data-category-id'),
                    content_type: 'C',
                    content: fields.content,
                });
            console.log(postData);
            $http.post(
                '/api/articles/'+fields.parent_id+'/comment/',
                postData
            )
            .success(function(data, status) {
                console.log('success');
                console.log(data);
                location.reload(0);
            })
            .error(function(data, status) {
                console.log(data);
                alert('댓글 등록에 실패했습니다');
            });
        }
    });

    $("textarea.autosize").keyup(function () {
        $scope.autosize($(this));
    });

    $scope.autosize = function(objs) {
        for (var i=0; i<objs.length; i++) {
            var obj = objs[i];
            $(obj).css("height","1px").css("height",($(obj).prop("scrollHeight"))+"px");
        }
    };
    $scope.autosize($('textarea'));

    $scope.article.html = new showdown.Converter().makeHtml($scope.article.content);
    console.log($scope.article.html);

    $scope.renderHtml = function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.post_comment = function(parent_id) {
        var content = $('.comment-form[data-parent-id="'+parent_id+'"] textarea').val();
        console.log(content);
    };

    $scope.show_comment_form = function(id) {
        console.log('id:', id);
        $('.comment-form[data-id='+id+']').css('display', 'block');
    };

    $scope.hide_comment_form = function() {
        $('.comment-form').css('display', 'none');
        $('.comment-form.default').css('display', 'block');
    };
    $scope.hide_comment_form();
}]);

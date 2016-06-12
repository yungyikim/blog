
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
        title: '',
        content: ''
    };
    $scope.board = {
        id: $('#board').attr('data-id'),
        name: $('#board').attr('data-name'),
    };
    $scope.category = {};


    console.log($('#board'));
    console.log($('#board').attr('data-name'));
    console.log($scope.board.name);

    $('.ui.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {
            $scope.category.id = value;
        }
    });
    $(".ui.sidebar")
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events','.launch');

    $('.following.bar').addClass('light');
    $('.following.bar .menu.inverted').removeClass('inverted');
    $('.menu .item').tab();

    $scope.preview_content = function() {
        console.log('preview_content()');
        console.log($scope.article.title);
        console.log($scope.article.content);
        $('#preview-title').text($scope.article.title);
        $scope.html = new showdown.Converter().makeHtml($scope.article.content);
        $scope.renderHtml = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    };

    $scope.post_article = function() {
        // 기본으로 제공하는 이미지들 중에서 랜덤으로 하나를 선정하여 기본이미지로 사용한다.
        var min = 1;
        var max = 10;
        var v = parseInt(Math.random() * (max - min) + min);
        var image_url = 'https://s3.ap-northeast-2.amazonaws.com/yungyikim.com/cover_img_'+v+'_800.jpg';

        var postData =
            JSON.stringify({
                board: $scope.board.id,
                category: $scope.category.id,
                title: $scope.article.title,
                summary: $scope.article.summary,
                content_type: 'A',
                content: $scope.article.content,
                image_url: image_url,
                group: 0,
                sequence: 0,
                depth: 0,
            });
        console.log(postData);
        $http.post(
            '/api/articles/',
            postData
        )
        .success(function(data, status) {
            console.log('success');
            console.log(data);
            alert('***** 게시물을 등록했습니다. *****');
            location.reload(true);
        })
        .error(function(data, status) {
            console.log(data);
            alert('게시물 등록에 실패했습니다');
        });
    };
}]);


var app = angular.module('myapp', ['ngRoute', 'ngCookies']);
app.config(function($httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

    var $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
        $cookies = _$cookies_;
    }]);
    console.log($cookies.get('csrftoken'));
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $cookies.get('csrftoken');
});
app.controller('MainCtrl', ['$scope', '$http', '$sce', '$cookies', function($scope, $http, $sce, $cookies) {
    $scope.user = {
        id: $('#user-info').attr('data-id')
    };

    console.log($cookies.get('csrftoken'));


    $(".ui.sidebar")
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events','.launch');

    $('.following.bar').addClass('light');
    $('.following.bar .menu.inverted').removeClass('inverted');
    $('.menu .item').tab();

    $scope.preview_content = function() {
        console.log('preview_content()');
        $scope.html = new showdown.Converter().makeHtml($scope.content);
        $scope.renderHtml = function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    };

    $scope.save_profile = function() {
        if ($scope.user.id) {
            // 프로필은 매번 새로 등록하여 히스토리를 남긴다.
            var postData = {
                owner: $scope.user.id,
                content: $scope.content
            };

            console.log(postData);

            $http.post(
                '/api/profiles/',
                postData
            )
            .success(function(data, status) {
                alert('***** 프로필 작성 성공 *****');
                location.href = '/';
            })
            .error(function(data, status) {
                alert('프로필 작성 실패! '+status);
            });
        }
        else {
            alert('작성 권한이 없다.');
        }
    };

    $scope.content = $('#source')[0].outerText;
    console.log($scope.content);
    $scope.preview_content();
}]);

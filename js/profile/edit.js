$(document).ready(function() {
    $('.menu .item').tab();
});

var app = angular.module('myapp', ['ngRoute']);
app.config(function($httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie('csrftoken');
});
app.controller('MainCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.user = {};
    $scope.content = '';

    $http.get(
        '/api/users'
    )
    .then(
        function(response) {
            console.log(response);
            $scope.user = response.data;
            return $http.get('/api/profiles');
        },
        function(error) {
            console.log(error);
        }
    )
    .then(
        function(response) {
            console.log(response);
            if (response) {
                // 마지막 항목을 보여준다.
                var profiles = response.data.results;
                if (response.data.count > 0) {
                    $scope.content = profiles[0].content;
                    $scope.preview_content();
                }
            }
        },
        function(error) {
            console.log(error);
        }
    );

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
}]);

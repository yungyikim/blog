
$(document).ready(function() {
});

var app = angular.module('myapp', ['ngRoute']);
app.controller('MainCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    var uri = URI(document.location);
    $scope.board_name = uri.segment()[0];
    $scope.article_id = uri.segment()[1];
    $scope.boards = [];
    $scope.categorys = new Array(20);

    console.log(uri);
    console.log($scope.board_name);
    console.log($scope.article_id);
    /*
    var re = /\/([0-9]+)\/?$/;
        var arr = location.pathname.match(re);
        if (arr) {
            docId = arr[1];
        }
        */
    $scope.article = {};

    $http.get('/api/boards')
        .then(
            function(response) {
                console.log(response);
                $scope.boards = response.data.results.slice(0);

                for (var i=0; i<$scope.boards.length; i++) {
                    if ($scope.board_name === $scope.boards[i].name) {
                        $scope.board_id = $scope.boards[i].id;
                    }
                }

                return $http.get('/api/categorys?board_id='+$scope.board_id);
            },
            function(error) {
                console.log(error);
            }
        )
        .then(
            function(response) {
                console.log(response);
                if (response) {
                    for (var i=0; i<response.data.results.length; i++) {
                        var category = response.data.results[i];
                        $scope.categorys[category.id] = category.name;
                    }
                    return $http.get('/api/articles/'+$scope.article_id);
                }
            },
            function(error) {
                console.log(error);
            }
        )
        .then(
            function(response) {
                console.log(response);
                if (response) {
                    $scope.article = response.data;
                    var category_name = $scope.categorys[$scope.article.category];
                    if (category_name === undefined) {
                        category_name = 'Uncategorized';
                    }

                    if ($scope.article.image_url === '') {
                        $scope.article.image_url = 'http://demo.shapedtheme.com/kotha/wp-content/uploads/2015/07/photo-1429041966141-44d228a42775-1140x600.jpeg';
                    }

                    var m = moment($scope.article.created);
                    $scope.article.category_name = category_name;
                    $scope.article.created_format = m.format('ll');
                    $scope.article.meta = 'By ' + $scope.article.email + ' / ' + m.format('ll') + ' / ' + category_name;

                    $scope.html = new showdown.Converter().makeHtml($scope.article.content);
                    console.log($scope.article.html);

                    $scope.renderHtml = function(htmlCode) {
                        return $sce.trustAsHtml(htmlCode);
                    };
                }
            },
            function(error) {
                console.log(error);
            }
        );

}]);

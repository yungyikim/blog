
var app = angular.module('myapp', ['ngRoute']);
app.config(function($httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie('csrftoken');
});
app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    var uri = URI(document.location);
    $scope.board_name = uri.segment()[0];
    $scope.categorys = [];
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
                        $scope.categorys.push(response.data.results[i]);
                    }

                    if ($scope.categorys.length > 0) {
                        $scope.selected_category = $scope.categorys[0].id;
                        console.log($scope.categorys[0]);
                        console.log($scope.selected_category);
                    }
                }
            },
            function(error) {
                console.log(error);
            }
        );

    $scope.post_article = function() {
        var postData =
            JSON.stringify({
                board: $scope.board_id,
                category: $scope.selected_category,
                title: $scope.article.title,
                summary: $scope.article.summary,
                content_type: 'A',
                content: $scope.article.content,
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
        })
        .error(function(data, status) {
            console.log(data);
        });
    };
}]);

$(document).ready(function() {
    $('.menu .item').tab();
    new Page();
});

function Page() {
    this.user = new UserModel();
    this.article = new ArticleModel();
    this.view = new View();
    this.init();
}

Page.prototype = {
    init: function() {
        var self = this;
        var url = new Url(jQuery(location).attr('href'));
        this.id = url.query.id;
        this.user.ready(function() {
            self.view.update(self.user);
        });
        this.article.get(this.id, function(data, status) {
            if (data) {
                self.view.update(self.user, data);
            }
            self.bind();
        });
    },
    bind: function() {
        var self = this;
        $('.item[data-tab=preview]').click(function() {
            var data = {
                title: $('#title').val(),
                content: $('#content').val(),
            };
            self.view.update(self.user, data);

            return false;
        });

        $('#save').click(function() {
            var title = $('#title').val();
            var content = $('#content').val();
            /*
            self.article.save(self.id, title, content, function(data, status) {
                if (data) {
                    location.href = '/view?id='+data.id;
                }
            });
            */

            return false;
        });

    }
};

function View() {
    this.converter = new showdown.Converter();
}

View.prototype = {
    update: function(user, data) {
        if (user && user.isAuthenticated()) {
            $('#user-email').text(user.email());
        }

        if (data) {
            $('#title').val(data.title);
            $('#content').val(data.content);
            var html = this.converter.makeHtml(data.content);
            $('#preview-title').text(data.title);
            $('#preview-content').html(html);
        }
    }
};

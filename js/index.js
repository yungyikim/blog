var host = 'http://'+document.location.host;

$(document).ready(function() {
    new Page();
});

function Page() {
    this._page = 1;
    this.user = new UserModel();
    this.article = new ArticleModel();
    this.view = new View();
    this.init();
}

Page.prototype = {
    init: function() {
        var self = this;

        $('#blog .pusher .masthead').removeClass('zoomed');

        if($(window).width() > 600) {
            $('body')
              .visibility({
                offset         : -10,
                observeChanges : false,
                once           : false,
                continuous     : false,
                onTopPassed: function() {
                  requestAnimationFrame(function() {
                    $('.following.bar')
                      .addClass('light fixed')
                      .find('.menu')
                        .removeClass('inverted')
                    ;
                    $('.following .additional.item')
                      .transition('scale in', 750)
                    ;
                  });
                },
                onTopPassedReverse: function() {
                  requestAnimationFrame(function() {
                    $('.following.bar')
                      .removeClass('light fixed')
                      .find('.menu')
                        .addClass('inverted')
                        .find('.additional.item')
                          .transition('hide')
                    ;
                  });
                }
              })
            ;
          }

        var url = new Url(jQuery(location).attr('href'));
        console.log(url.query.page);
        if (url.query.page) this._page = url.query.page;

        this.user.ready(function() {
            self.view.updateUserInfo(self.user);
        });
        this.article.update(this._page, function(data, status) {
            self.view.update(self.article);
            self.bind();
        });

        $('section.featured .container').slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              }
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
        });

    },
    bind: function() {
        var self = this;
        $('#signout-link').click(function() {
            self.user.signout(function() {
                location.reload(true);
            });

            return false;
        });

    }
};

function View() {

}

View.prototype = {
    update: function(article) {
        var results = article.articles();
        var prevPage = article.prevPage();
        var nextPage = article.nextPage();

        if (results) {
            for (var i in results) {
                console.log(results[i]);
                var html = '<article><header><a href="/view?id='+results[i].id+'"><h4>'+results[i].title+'</h4></a></header><i class="owner">'+results[i].email+'</i></article>';
                $('.article-list').append(html);
            }
        }
        if (prevPage) {
            $('#prev-link').attr('href', '/list?page='+prevPage);
            $('#prev-link').css('display', 'inline');
        }
        if (nextPage) {
            $('#next-link').attr('href', '/list?page='+nextPage);
            $('#next-link').css('display', 'inline');
        }
    },
    updateUserInfo: function(user) {
        if (user.isAuthenticated()) {
            $('#edit-link').css('display', 'inline');
            $('#signout-link').text('로그아웃('+user.email()+')');
            $('#signout-link').css('display', 'inline');
        }
        else {
            $('#signin-link').css('display', 'inline');
            $('#signup-link').css('display', 'inline');
        }
    }
};

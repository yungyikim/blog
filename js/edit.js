
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
            self.article.save(self.id, title, content, function(data, status) {
                if (data) {
                    location.href = '/view?id='+data.id;
                }
            });

            return false;
        });

    }
};

function View() {
    this.converter = new showdown.Converter();
}

View.prototype = {
    update: function(user, data) {
        console.log('update', data);
        console.log(user);
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

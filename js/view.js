
$(document).ready(function() {
    new Page();
});

function Page() {
    this.id = null;
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
        $('#edit-link').attr('href', '/edit?id='+this.id);

        this.user.ready();
        this.article.get(this.id, function(data, status) {
            if (data) {
                self.view.update(self.user, data);
                $('.comment-write .ui.form').attr('data-id', self.id);
                $('.comment-write button').attr('data-id', self.id);
            }
        });
        this.article.updateComment(this.id, function(data, status) {
            if (data) {
                self.view.updateComment(data);
            }
            self.bind();
        });
    },
    bind: function() {
        var self = this;

        $('#delete-link').click(function() {
            self.article.delete(self.id, function(data) {
                location.href = '/list';
            });
            return false;
        });

        $('.comment-write button').click(function() {
            var id = $(this).attr('data-id');
            var content = $('.comment-write .ui.form[data-id='+id+'] textarea').val();
            self.article.saveComment(id, content, function(data) {
                location.reload(true);
            });
            return false;
        });

        $('.sub-comment-write button').click(function() {
            var id = $(this).attr('data-id');
            var content = $('.sub-comment-write .ui.form[data-id='+id+'] textarea').val();
            self.article.saveComment(id, content, function(data) {
                location.reload(true);
            });
            return false;
        });

        $('.comment-view a').click(function() {
            var id = $(this).attr('data-id');
            $('.sub-comment-write[data-id="'+id+'"]').css('display', 'flex');
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
            // 자신이 작성한 게시물일 경우 '편집', '삭제' 버튼을 보여준다.
            if (user.id() === data.owner) {
                $('#edit-link, #delete-link').css('display', 'inline');
            }
            // 로그인 상태라면 댓글 작성 부분을 활성화 시키자
            $('textarea, button').removeAttr('disabled');
        }

        if (data) {
            $('#owner').text(data.email);
            // 내용 출력
            $('#preview-title').text(data.title);
            var html = this.converter.makeHtml(data.content);
            $('#preview-content').html(html);
        }
    },
    updateComment: function(data) {
        if (data) {
            for (var i in data) {
                var html = '<div class="comment-view depth-'+data[i].depth+'"><i class="owner">'+data[i].email+'</i><a href="#" data-id="'+data[i].id+'">댓글</a><p>'+data[i].content+'</p><div class="sub-comment-write" data-id="'+data[i].id+'"><div class="ui form" data-id="'+data[i].id+'"><div class="field"><textarea rows="1" disabled=""></textarea></div></div><div><button class="ui button" data-id="'+data[i].id+'" disabled="">내용입력</button></div></div></div>';
                $('.comment-list').append(html);
            }
        }
    }
};

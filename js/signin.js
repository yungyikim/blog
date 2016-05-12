
var host = 'http://'+document.location.host;

$(document).ready(function() {
    new Page();
});

function Page() {
    this.init();
    this.user = new UserModel();
}

Page.prototype = {
    init: function() {
        this.bind();
    },
    bind: function() {
        var self = this;
        $('#signin').click(function() {
            var email = $('.form input[name=email]').val();
            var password = $('.form input[name=password]').val();
            self.user.signin(email, password, function(data, status) {
                if (data) {
                    location.href='/list';
                }
                else {
                    alert('잘못된 아이디 또는 비밀번호입니다.');
                }
            });
        });

        $('input[name=password]').keypress(function(e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) { // enter
                $('#signin').trigger('click');
            }
        });
    },
};

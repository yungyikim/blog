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
        $('#signup').click(function() {
            var email = $('.form input[name=email]').val();
            var password = $('.form input[name=password]').val();
            var passwordConfirm = $('.form input[name=password-confirm]').val();

            self.user.signup(email, password, function(data, status) {
                if (data) {
                    location.href = '/list';
                }
                else {
                    alert('회원가입에 실패했습니다.');
                }
            });
        });
    },
};

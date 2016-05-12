var email = guid()+'@example.com';
var password = '1234';

describe('사용자관리', function() {
    var user = new UserModel();
    beforeEach(function(done) {
        console.log(user);
        console.log('beforeEach');
        done();
    });
    it('신규 사용자 등록', function(done) {
        console.log('create');
        user.signup(email, password, function(data) {
            console.log(data);
            expect(data.msg).toEqual("success");
            done();
        });
    });
    it('사용자 정보 조회', function(done) {
        console.log('aaa');
        user.ready(function() {
            console.log(user.email());
            console.log(email);
            expect(user.email()).toEqual(email);
            done();
        });
    });
    it('로그인', function(done) {
        console.log('signin');
        user.signin(email, password, function(data) {
            console.log(data);
            console.log(email);
            expect(data.msg).toEqual("success");
            expect(user.email()).toEqual(email);
            done();
        });
    });
    it('로그아웃', function(done) {
        console.log('signout');
        user.signout(function(data) {
            console.log(data);
            expect(data.msg).toEqual("success");
            done();
        });
    });
});

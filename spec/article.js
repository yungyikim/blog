

describe('게시물관리', function() {
    var userModel = new UserModel();
    var articleModel = new ArticleModel();
    var article = {
        title: 'test-title',
        content: 'test-content',
        updatedTitle: 'test-updated-title',
        updatedContent: 'test-updated-content'
    };
    var comment = {
        content: 'test-comment',
    };
    var articleId = null;
    var commentId = null;

    beforeEach(function(done) {
        console.log(email);
        console.log('beforeEach');
        // 사용자 관리 테스트시에 생성된 계정으로 로그인
        userModel.signin(email, password, function(data) {
            done();
        });
    });

    it('게시물 등록', function(done) {
        articleModel.save(null, article.title, article.content, function(data) {
            console.log(data);
            articleId = data.id;
            expect(data.title).toEqual(article.title);
            done();
        });
    });
    it('게시물 조회', function(done) {
        articleModel.get(articleId, function(data){
            console.log(data);
            expect(data.title).toEqual(article.title);
            done();
        });
    });
    it('게시물 수정', function(done) {
        articleModel.save(articleId, article.updatedTitle, article.updatedContent, function(data) {
            console.log(data);
            expect(data.title).toEqual(article.updatedTitle);
            done();
        });
    });
    it('댓글 등록', function(done) {
        articleModel.saveComment(articleId, comment.content, function(data) {
            console.log(data);
            commentId = data.id;
            expect(data.content).toEqual(comment.content);
            expect(data.sequence).toEqual(2);
            expect(data.depth).toEqual(1);
            done();
        });
    });
    it('댓글에 댓글 등록', function(done) {
        articleModel.saveComment(commentId, comment.content, function(data){
            console.log(data);
            expect(data.sequence).toEqual(3);
            expect(data.depth).toEqual(2);
            done();
        });
    });
    it('게시물 삭제', function(done) {
        articleModel.delete(articleId, function(data){
            console.log(data);
            articleModel.get(articleId, function(data, status){
                console.log(data);
                var title = '';
                if (data) {
                    title = data.title;
                }
                expect(title).toEqual('');
                done();
            });
        });
    });
});

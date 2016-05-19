var host = 'http://'+document.location.host;

/*
 *  DB 처리
 */

function ArticleModel() {
    this.page = null;
    this._prevPage = null;
    this._nextPage = null;
    this._articles = null;
}

ArticleModel.prototype = {
    ready: function(callback) {
        this.update(function(status) {
            if (callback) callback(status);
        });
    },
    update: function(page, callback) {
        var self = this;
        var url = host+'/api/articles/?page='+page;
        if (this.page) {
            url = url + '?page=' + this.page;
        }

        jQuery.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function(data) {
                self._prevPage = null;
                self._nextPage = null;
                self._articles = null;

                if (data.previous) {
                    var url = new Url(data.previous);
                    if (url.query.page) {
                        self._prevPage = url.query.page;
                    }
                    else {
                        self._prevPage = 1;
                    }
                }
                if (data.next) {
                    var url = new Url(data.next);
                    self.page = url.query.page;
                    self._nextPage = url.query.page;
                    console.log('page:',self.page);
                }

                if (data.results) self._articles = data.results;

                if (callback) callback(data);
            },
            error: function(e) {
                if (callback) callback(null, e.status);
            }
        });
    },
    updateComment: function(group, callback) {
        console.log('group:',group);
        if (group) {
            jQuery.ajax({
                type: 'GET',
                url: host+'/api/articles/'+group+'/comment/',
                dataType: 'json',
                success: function(data) {
                    if (callback) callback(data);
                },
                error: function(e) {
                    if (callback) callback(null, e.status);
                }
            });
        }
        else {
            if (callback) callback(null, 999);
        }
    },
    prevPage: function() {
        return this._prevPage;
    },
    nextPage: function() {
        return this._nextPage;
    },
    articles: function() {
        return this._articles;
    },
    save: function(id, board_id, category_id, title, summary, content, callback) {
        var data = {
            board: board_id,
            category: category_id,
            title: title,
            summary: summary,
            content_type: 'A',
            content: content,
            group: 0,
            sequence: 0,
            depth: 0,
        };

        if (id) {
            jQuery.ajax({
                type: 'PUT',
                url: host+'/api/articles/'+id+'/',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                },
                success: function(data) {
                    console.log(data);
                    if (callback) callback(data);
                },
                error: function(e) {
                    console.log('error!!');
                    if (callback) callback({}, e.status);
                }
            });
        }
        else {
            jQuery.ajax({
                type: 'POST',
                url: host+'/api/articles/',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                },
                success: function(data) {
                    console.log(data);
                    if (callback) callback(data);
                },
                error: function(e) {
                    console.log('error!!');
                    if (callback) callback({}, e.status);
                }
            });
        }
    },
    saveComment: function(parentId, content, callback) {
        if (parentId) {
            var data = {
                content_type: 'C',
                content: content,
            };

            $.ajax({
                type: 'POST',
                url: host+'/api/articles/'+parentId+'/comment/',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function (xhr) {
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                },
                success: function(data) {
                    console.log(data);
                    if (callback) callback(data);
                },
                error: function(e) {
                    console.log('error!!');
                    if (callback) callback({}, e.status);
                }
            });
        }
        else {
            if (callback) callback({}, 999);
        }
    },
    delete: function(id, callback) {
        if (id) {
            $.ajax({
                type: 'DELETE',
                url: host+'/api/articles/'+id,
                dataType: 'json',
                beforeSend: function (xhr) {
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                },
                success: function(data) {
                    if(callback) callback(data);
                },
                error: function(e) {
                    if(callback) callback({}, e.status);
                }
            });
        }
    },
    get: function(id, callback) {
        if (id) {
            jQuery.ajax({
                type: 'GET',
                url: host+'/api/articles/'+id,
                dataType: 'json',
                beforeSend: function (xhr) {
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                },
                success: function(data, status) {
                    console.log(data);
                    if (callback) callback(data, status);
                },
                error: function(e) {
                    console.log('error!!');
                    if (callback) callback({}, e.status);
                }
            });
        }
        else {
            if (callback) callback({}, 999);
        }
    },
};

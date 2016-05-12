var host = 'http://'+document.location.host;

function UserModel() {
    this._id = null;
    this._email = null;
}

UserModel.prototype = {
    _init: function() {
    },
    _update: function(callback) {
        var self = this;
        $.ajax({
            type: 'GET',
            url: host+'/api/users/',
            dataType: 'json',
            success: function(data) {
                self._id = data.id;
                self._email = data.email;
                if (callback) callback(data);
            },
            error: function(e) {
                if (callback) callback({}, e.status);
            }
        });
    },
    ready: function(callback) {
        console.log('ready');
        this._update(function(data, status) {
            if (callback) callback(data, status);
        });
    },
    signup: function(email, password, callback) {
        var data = {
            email: email,
            password: password,
            department: 1
        };

        jQuery.ajax({
            type: 'POST',
            url: host+'/api/users/',
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
                console.log(e);
                if (callback) callback({}, e.status);
            }
        });
    },
    signin: function(email, password, callback) {
        var data = {
            email: email,
            password: password,
        };

        jQuery.ajax({
            type: 'POST',
            url: host+'/api/auth/signin/',
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
                console.log(e);
                if (callback) callback({}, e.status);
            }
        });
    },
    signout: function(callback) {
        $.ajax({
            type: 'POST',
            url: host+'/api/auth/signout/',
            dataType: 'json',
            success: function(data) {
                if (callback) callback(data);
            },
            error: function(e) {
                if (callback) callback({}, e);
            }
        });
    },
    isAuthenticated: function() {
        if (this._id) {
            return true;
        }

        return false;
    },
    id: function() {
        return this._id;
    },
    email: function() {
        return this._email;
    }
};

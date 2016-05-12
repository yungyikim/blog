/*
 Common
 */
function Common() {}
Common.prototype = {
    generateId : function() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};
var common = new Common();

function makeWidget(type, id) {
    if (type == 'empty') {
        return new EmptyWidget(id);
    }
    else if (type == 'short-text') {
        return new ShortTextWidget(id);
    }
    else if (type == 'long-text') {
        return new LongTextWidget(id);
    }
    else if (type == 'radio') {
        return new RadioWidget(id);
    }
    else if (type == 'checkbox') {
        return new CheckboxWidget(id);
    }
    else if (type == 'dropdown') {
        return new DropdownWidget(id);
    }
}

function RayformViewer(elementId) {
    this._node = null;
    this._mainElementId = 'rayform-view-main';
    this._elementId = elementId;
}
RayformViewer.prototype = {
    show : function() {
        jQuery('#'+this._mainElementId).css('display', 'block');
    },
    import : function(obj) {
        jQuery('#'+this._mainElementId).remove();
        console.log(obj);
        this._node = jQuery('<div id="'+this._mainElementId+'">');
        jQuery('#'+this._elementId).append(this._node);
        var questions = obj;
        for (var i in questions) {
            var divNode = jQuery('<div data-type="'+questions[i].type+'">');
            this._makeTitle(divNode, questions[i]);
            this._makeOptions(divNode, questions[i]);
            this._node.append(divNode);
        }
    },
    export: function() {
        var data = [];
        jQuery('#'+this._mainElementId+' > div').each(function(index) {
            var item = {
                title: null,
                type: null,
                value: null,
                optionValues: []
            };
            var node = jQuery(this);
            console.log(node);
            var title = node.find('h4').text();
            console.log('title:'+title);
            var type = node.attr('data-type');
            console.log('type:'+type);

            item.title = title;
            item.type = type;
            if (type === 'short-text') {
                value = node.find('input').val();
                console.log('value:'+value);
                item.value = value;
            }
            else if (type === 'long-text') {
                value = node.find('textarea').val();
                console.log('value:'+value);
                item.value = value;
            }
            else if (type === 'radio') {
                node.find('input[type=radio]:checked').each(function(idx) {
                    console.log(jQuery(this).val());
                    item.optionValues.push(jQuery(this).val());
                });
            }
            else if (type === 'checkbox') {
                node.find('input[type=checkbox]:checked').each(function(idx) {
                    console.log(jQuery(this).val());
                    item.optionValues.push(jQuery(this).val());
                });
            }
            else if (type === 'dropdown') {
                node.find('option:checked').each(function(idx) {
                    console.log(jQuery(this).val());
                    item.optionValues.push(jQuery(this).val());
                });
            }
            data.push(item);
        });
        return data;
    },
    _makeTitle: function(parentNode, obj) {
        console.log(obj);
        var titleNode = jQuery('<h4>');
        titleNode.text(obj.title);
        parentNode.append(titleNode);
    },
    _makeOptions: function(parentNode, obj) {
        var contentsNode = jQuery('<div>');
        if (obj.type === 'short-text') {
            node = jQuery('<div class="control-wrap">');
            node.append('<input class="control" type=text>');
            contentsNode.append(node);
        }
        else if (obj.type === 'long-text') {
            node = jQuery('<div class="control-wrap">');
            node.append('<textarea class="control" rows="3">');
            contentsNode.append(node);
        }
        else if (obj.type === 'radio') {
            node = jQuery('<div class="control-wrap option radio"> </div>');
            options = obj.options;
            for (var i in options) {
                node.append('<label class="control-label"> <input class="" type="radio" name="group-1" value="'+options[i]+'"> <span>'+options[i]+'</span> </label>');
            }
            contentsNode.append(node);
        }
        else if (obj.type === 'checkbox') {
            node = jQuery('<div class="control-wrap option radio"> </div>');
            options = obj.options;
            for (var i in options) {
                node.append('<label class="control-label"> <input class="" type="checkbox" name="group-1" value="'+options[i]+'"> <span>'+options[i]+'</span> </label>');
            }
            contentsNode.append(node);
        }
        else if (obj.type === 'dropdown') {
            node = jQuery('<div class="control-wrap option radio"> </div>');
            var selectNode = jQuery('<select>');
            options = obj.options;
            for (var i in options) {
                selectNode.append('<option value="'+options[i]+'">'+options[i]+'<option');
            }
            node.append(selectNode);
            contentsNode.append(node);
        }
        parentNode.append(contentsNode);
    }
};



function RayformEditor(elementId) {
    this._elementId = elementId;
    this._mainElementId = 'rayform-main';
    this._node = null;
    this._init();
}
RayformEditor.prototype = {
    _init: function() {
        this._node = jQuery('<div id="'+this._mainElementId+'">"');
        jQuery('#'+this._elementId).append(this._node);
        return this;
    },
    after: function(widget, targetWidgetId) {
        if (targetWidgetId === undefined) {
            jQuery('#'+this._mainElementId).append(widget.exportHTML());
        }
        else {
            jQuery('#'+targetPanelId).after(widget.exportHTML());
        }
        widget.eventOn();
    },
    export: function() {
        var data = [];
        jQuery('#'+this._mainElementId+' .panel').each(function(index) {
            var node = jQuery(this);
            var id = node.attr('id');
            var type = node.attr('data-type');
            if (type !== 'empty') {
                var widget = makeWidget(type, id);
                console.log(widget.exportData());
                data.push(widget.exportData());
            }
            /*
            console.log(index+': '+jQuery(this));
            data.push(new Panel().export(this));
            */
        });
        return data;
    },
    import: function(obj) {
        for (var i in obj) {
            // 위젯을 생성하고 추가한 후
            var widget = makeWidget(obj[i].type);
            this.after(widget);
            // 데이터를 반영한다.
            widget.importData(obj[i]);
        }
    },
    show: function() {
        jQuery('#'+this._mainElementId).css('display', 'block');
    }

};

function WidgetToolbar(id) {
    this.id = id;
    this._defaultHtml = '<div class="toolbar-menu"> <div class="toolbar-wrap"> <h4><a href="#" class="plus">+</a></h4> <div class="toolbar"> <a href="#"><i class="" data-question-type="short-text">단답형</i></a> <a href="#"><i class="" data-question-type="long-text">장문형</i></a> <a href="#"><i class="" data-question-type="radio">객관식</i></a> <a href="#"><i class="" data-question-type="checkbox">체크박스</i></a> <a href="#"><i class="" data-question-type="dropdown">드롭다운</i></a> </div> </div> </div>';
}
WidgetToolbar.prototype = {
    eventOn: function() {
        var self = this;
        jQuery('#'+this.id+' .toolbar-wrap h4 a.plus').click(function() {
            self.show();
            return false;
        });
        jQuery('#'+this.id+' .toolbar-wrap .toolbar > a').click(function() {
            self.hide();
            var type = jQuery(this).find('i').data('question-type');
            console.log(type);

            var widget = makeWidget(type);
            jQuery('#'+self.id).after(widget.exportHTML());
            widget.eventOn();

            return false;
        });
    },
    show : function() {
        jQuery('#'+this.id+' .toolbar-wrap h4').css('display', 'none');
        jQuery('#'+this.id+' .toolbar-wrap .toolbar').css('display', 'inherit');
        return this;
    },
    hide : function() {
        jQuery('#'+this.id+' .toolbar-wrap .toolbar').css('display', 'none');
        jQuery('#'+this.id+' .toolbar-wrap h4').css('display', 'inherit');
        return this;
    },
    exportHTML: function() {
        var node = jQuery(this._defaultHtml);
        return node[0];
    }
};

/*
 Panel
 */
function Widget() {
}
Widget.prototype = {
    eventOn: function() {
        var self = this;
        jQuery('#'+this.id+' .panel-inner .header a').click(function() {
            var action = jQuery(this).data('type');
            if (action == 'delete') {
                jQuery('div[id='+self.id+']').remove();
            }
            else {
                self._move(action);
            }
            return false;
        });

        this._toolbar.eventOn();
        this._eventOn();
    },
    _searchPosition : function() {
        var current = jQuery('#'+this.id);
        var currentId = this.id;
        var parent = current.parent();
        var prevId = null;
        var nextId = null;
        var found = false;
        parent.children().each(function() {
            var id = jQuery(this).attr('id');

            if(id) {
                if (!found) {
                    if (id == currentId) {
                        found = true;
                    }
                    else {
                        prevId = id;
                    }
                }
                else {
                    if (id != currentId) {
                        if (!nextId) {
                            nextId = id;
                        }
                    }
                }
            }
        });

        return {prevId:prevId, nextId:nextId};
    },
    _move : function(direction) {
        var node = jQuery('#'+this.id);
        var prevNode = null;
        var nextNode = null;
        var ids = this._searchPosition();

        if (ids.prevId) {
            prevNode = jQuery('#'+ids.prevId);
        }
        if (ids.nextId) {
            nextNode = jQuery('#'+ids.nextId);
        }

        if (direction == 'up') {
            if (prevNode && prevNode.attr('data-type') === 'empty') {
                return this;
            }
            node.insertBefore(prevNode);
        }
        else if (direction == 'down') {
            if (nextNode && nextNode.attr('data-type') === 'empty') {
                return this;
            }
            node.insertAfter(nextNode);
        }

        return this;
    },
};

/*
 EmptyPanel
 */
function EmptyWidget() {
    this.id = common.generateId();
    this._defaultHtml = '<div class="panel empty" data-type="empty"> </div>';
    this._toolbar = new WidgetToolbar(this.id);
}
EmptyWidget.prototype = new Widget();
EmptyWidget.prototype._eventOn = function() {};
EmptyWidget.prototype.exportHTML = function() {
    var node = jQuery(this._defaultHtml);
    node.attr('id', this.id);
    node.append(this._toolbar.exportHTML());
    console.log(node, node[0].outerHTML);
    return node[0].outerHTML;
};
EmptyWidget.prototype.exportData = function() {
    return null;
};
EmptyWidget.prototype.importData = function(obj) {
    return this;
};

/*
 ShortTextPanel
 */
function ShortTextWidget(id) {
    if (id === undefined) {
        id = common.generateId();
    }
    this.id = id;
    this._defaultHtml = '<div class="panel short-text" data-type="short-text"> <div class="panel-inner"> <div class="header"> <a href="#" data-type="up">위</a> : <a href="#" data-type="down">아래</a> : <a href="#" data-type="delete">삭제</a> </div> <div class="section"> <h4>단답형 질문</h4> <div class="article"> <div class="control-wrap"> <input class="control" id="title" type="text" placeholder="질문 내용을 입력하세요"> </div> <div class="control-wrap"> <input class="control" type="text" value="" disabled="disabled"> </div> </div> </div> <div class="footer"> </div> </div> </div> </div>';
    this._toolbar = new WidgetToolbar(id);
}
ShortTextWidget.prototype = new Widget();
ShortTextWidget.prototype._eventOn = function() {};
ShortTextWidget.prototype.exportHTML = function() {
    var node = jQuery(this._defaultHtml);
    node.attr('id', this.id);
    node.append(this._toolbar.exportHTML());
    console.log(node, node[0].outerHTML);
    return node[0].outerHTML;
};
ShortTextWidget.prototype.exportData = function() {
    var data = {
        title: null,
        type: 'short-text'
    };
    var node = jQuery('#'+this.id);
    var title = node.find('#title').val();
    console.log('title:'+title);
    data.title = title;
    return data;
};
ShortTextWidget.prototype.importData = function(obj) {
    var node = jQuery('#'+this.id);
    node.find('#title').attr('value', obj.title);
    return this;
};

/*
 LongTextPanel
 */
function LongTextWidget(id) {
    if (id === undefined) {
        id = common.generateId();
    }
    this.id = id;
    this._defaultHtml = '<div class="panel long-text" data-type="long-text"> <div class="panel-inner"> <div class="header"> <a href="#" data-type="up">위</a> : <a href="#" data-type="down">아래</a> : <a href="#" data-type="delete">삭제</a> </div> <div class="section"> <h4>장문형 질문</h4> <div class="article"> <div class="control-wrap"> <input class="control" id="title" type="text" placeholder="질문 내용을 입력하세요"> </div> <div class="control-wrap"> <textarea class="control" rows="3" disabled="disabled"></textarea> </div> </div> </div> <div class="footer"> </div> </div> </div>';
    this._toolbar = new WidgetToolbar(id);
}
LongTextWidget.prototype = new Widget();
LongTextWidget.prototype._eventOn = function() {};
LongTextWidget.prototype.exportHTML = function() {
    var node = jQuery(this._defaultHtml);
    if (this.id === undefined) {
        this.id = common.generateId();
    }
    node.attr('id', this.id);
    node.append(this._toolbar.exportHTML());
    console.log(node, node[0].outerHTML);
    return node[0].outerHTML;
};
LongTextWidget.prototype.exportData = function() {
    var data = {
        title: null,
        type: 'long-text'
    };
    var node = jQuery('#'+this.id);
    var title = node.find('#title').val();
    console.log('title:'+title);
    data.title = title;
    return data;
};
LongTextWidget.prototype.importData = function(obj) {
    var node = jQuery('#'+this.id);
    node.find('#title').attr('value', obj.title);
    return this;
};

/*
 RadioPanel
 */

 function RadioWidget(id) {
     if (id === undefined) {
         id = common.generateId();
     }
     this.id = id;
     this._defaultHtml = '<div class="panel radio" data-type="radio"> <div class="panel-inner"> <div class="header"> <a href="#" data-type="up">위</a> : <a href="#" data-type="down">아래</a> : <a href="#" data-type="delete">삭제</a> </div> <div class="section"> <h4>객관식 질문</h4> <div class="article"> <div class="control-wrap"> <input class="control" id="title"  type="text" placeholder="질문 내용을 입력하세요"> </div> <div class="control-wrap option radio"> </div> <div class="add-option"> <a href="#">옵션 추가</a> </div> </div> </div> <div class="footer"> </div> </div> </div>';
     this._optionHtml = '<label class="control-label"> <input class="" type="radio" name="group-1" value=""> <input class="control option-value" type="text" value=""> </label>';
     this._toolbar = new WidgetToolbar(id);
 }
 RadioWidget.prototype = new Widget();
 RadioWidget.prototype._eventOn = function() {
     var self = this;
     var node = jQuery('#'+this.id);
     node.find('.add-option a').click(function() {
         self._addOption();
         return false;
     });
     return this;
 };
 RadioWidget.prototype._addOption = function(value) {
     var node = jQuery('#'+this.id);
     var optionNode = jQuery(this._optionHtml);
     if (value !== undefined) {
         optionNode.find('input').attr('value', value);
     }
     node.find('.control-wrap.option.radio').append(optionNode);
     return this;
 };
 RadioWidget.prototype.exportHTML = function() {
     var node = jQuery(this._defaultHtml);
     node.attr('id', this.id);
     node.append(this._toolbar.exportHTML());
     console.log(node, node[0].outerHTML);
     return node[0].outerHTML;
 };
 RadioWidget.prototype.exportData = function() {
     var data = {
         title: null,
         type: 'radio',
         options: null
     };
     var node = jQuery('#'+this.id);
     var title = node.find('#title').val();
     console.log('title:'+title);
     data.title = title;
     var options = [];
     node.find('.option-value').each(function(index) {
         var value = jQuery(this).val();
         if (value) {
             console.log(value);
             options.push(value);
         }
     });
     data.options = options;
     return data;
 };
 RadioWidget.prototype.importData = function(obj) {
     var node = jQuery('#'+this.id);
     node.find('#title').attr('value', obj.title);
     for (var i in obj.options) {
         this._addOption(obj.options[i]);
     }
     return this;
 };

/*
 CheckboxPanel
 */
 function CheckboxWidget(id) {
     if (id === undefined) {
         id = common.generateId();
     }
     this.id = id;
     this._defaultHtml = '<div class="panel checkbox" data-type="checkbox"> <div class="panel-inner"> <div class="header"> <a href="#" data-type="up">위</a> : <a href="#" data-type="down">아래</a> : <a href="#" data-type="delete">삭제</a> </div> <div class="section"> <h4>체크박스</h4> <div class="article"> <div class="control-wrap"> <input class="control" id="title"  type="text" placeholder="질문 내용을 입력하세요"> </div> <div class="control-wrap option checkbox"> </div> <div class="add-option"> <a href="#">옵션 추가</a> </div> </div> </div> <div class="footer"> </div> </div> </div>';
     this._optionHtml = '<label class="control-label"> <input class="" type="checkbox" name="group-1" value=""> <input class="control option-value" type="text" value=""> </label>';
     this._toolbar = new WidgetToolbar(id);
 }
 CheckboxWidget.prototype = new Widget();
 CheckboxWidget.prototype._eventOn = function() {
     var self = this;
     var node = jQuery('#'+this.id);
     node.find('.add-option a').click(function() {
         self._addOption();
         return false;
     });
     return this;
 };
 CheckboxWidget.prototype._addOption = function(value) {
     var node = jQuery('#'+this.id);
     var optionNode = jQuery(this._optionHtml);
     if (value !== undefined) {
         optionNode.find('input').attr('value', value);
     }
     node.find('.control-wrap.option.checkbox').append(optionNode);
     return this;
 };
 CheckboxWidget.prototype.exportHTML = function() {
     var node = jQuery(this._defaultHtml);
     node.attr('id', this.id);
     node.append(this._toolbar.exportHTML());
     console.log(node, node[0].outerHTML);
     return node[0].outerHTML;
 };
 CheckboxWidget.prototype.exportData = function() {
     var data = {
         title: null,
         type: 'checkbox',
         options: null
     };
     var node = jQuery('#'+this.id);
     var title = node.find('#title').val();
     console.log('title:'+title);
     data.title = title;
     var options = [];
     node.find('.option-value').each(function(index) {
         var value = jQuery(this).val();
         if (value) {
             console.log(value);
             options.push(value);
         }
     });
     data.options = options;
     return data;
 };
 CheckboxWidget.prototype.importData = function(obj) {
     var node = jQuery('#'+this.id);
     node.find('#title').attr('value', obj.title);
     for (var i in obj.options) {
         this._addOption(obj.options[i]);
     }
     return this;
 };


/*
 DropdownPanel
 */

 function DropdownWidget(id) {
     if (id === undefined) {
         id = common.generateId();
     }
     this.id = id;
     this._defaultHtml = '<div class="panel dropdown" data-type="dropdown"> <div class="panel-inner"> <div class="header"> <a href="#" data-type="up">위</a> : <a href="#" data-type="down">아래</a> : <a href="#" data-type="delete">삭제</a> </div> <div class="section"> <h4>드롭다운</h4> <div class="article"> <div class="control-wrap"> <input class="control" id="title" type="text" placeholder="질문 내용을 입력하세요"> </div> <div class="control-wrap option checkbox"></div> <div class="add-option"> <a href="#">옵션 추가</a> </div> </div> </div> <div class="footer"> </div> </div> </div>';
     this._optionHtml = '';
     this._toolbar = new WidgetToolbar(id);
 }
 DropdownWidget.prototype = new Widget();
 DropdownWidget.prototype._eventOn = function() {
     var self = this;
     var node = jQuery('#'+this.id);
     node.find('.add-option a').click(function() {
         self._addOption();
         return false;
     });
     return this;
 };
 DropdownWidget.prototype._addOption = function(value) {
     var node = jQuery('#'+this.id);
     var no = node.find('.control-wrap.option.checkbox').children().length + 1;
     var optionNode = jQuery('<label class="control-label">'+no+'<input class="control option-value" type="text" value=""> </label>');
     if (value !== undefined) {
         optionNode.find('input').attr('value', value);
     }
     node.find('.control-wrap.option.checkbox').append(optionNode);
     return this;
 };
 DropdownWidget.prototype.exportHTML = function() {
     var node = jQuery(this._defaultHtml);
     node.attr('id', this.id);
     node.append(this._toolbar.exportHTML());
     console.log(node, node[0].outerHTML);
     return node[0].outerHTML;
 };
 DropdownWidget.prototype.exportData = function() {
     var data = {
         title: null,
         type: 'dropdown',
         options: null
     };
     var node = jQuery('#'+this.id);
     var title = node.find('#title').val();
     console.log('title:'+title);
     data.title = title;
     var options = [];
     node.find('.option-value').each(function(index) {
         var value = jQuery(this).val();
         if (value) {
             console.log(value);
             options.push(value);
         }
     });
     data.options = options;
     return data;
 };
 DropdownWidget.prototype.importData = function(obj) {
     var node = jQuery('#'+this.id);
     node.find('#title').attr('value', obj.title);
     for (var i in obj.options) {
         this._addOption(obj.options[i]);
     }
     return this;
 };

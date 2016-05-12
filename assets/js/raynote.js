/*
jQuery(document).ready(function() {
    console.log('ready()');
    raynote = new Raynote('#editor');
    panel = new TextPanel('수백만 명의 모바일 사용자에게 사진을 공유하는 애플리케이션을 운영하든 비즈니스의 중요 운영을 지원하든 관계없이 "클라우드"는 유연하고 비용이 저렴한 IT 리소스에 대한 빠른 액세스를 제공합니다. 클라우드 컴퓨팅을 사용하면 하드웨어에 막대한 사전 투자를 하거나 하드웨어를 유지 관리하기 위해 많은 시간을 할애하지 않아도 됩니다. 그 대신 새로운 아이디어를 실현하거나 IT 부서를 운영하는 데 필요한 컴퓨팅 리소스의 유형 및 크기를 정확하게 프로비저닝할 수 있습니다. 필요한 만큼의 리소스에 거의 바로 액세스할 수 있으며 사용한 만큼의 리소스에 대해서만 비용을 지불합니다.');
    raynote.appendPanel(panel, 0);
    panel = new TextPanel('비용이 저렴한 IT 리소스에 대한 빠른 액세스를 제공합니다. 클라우드 컴퓨팅을 사용하면 하드웨어에 막대한 사전 투자를 하거나 하드웨어를 유지 관리하기 위해 많은 시간을 할애하지 않아도 됩니다.');
    raynote.appendPanel(panel, 0);
    panel = new TextPanel('저렴한 IT 리소스에 대한 빠른 액세스를 제공합니다. 클라우드 컴퓨팅을 사용하면 하드웨어에 막대한 사전 투자를 하거나 하드웨어를 유지 관리하기 위해 많은 시간을 할애하지 않아도 됩니다.');
    raynote.appendPanel(panel, 0);
});

jQuery(window).load(function() {
    console.log('load()');
});
*/
(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);

/*
 Common
 */
function Common() { }
Common.prototype = {
    generateId : function() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
};
var common = new Common();

/*
 Raynote
 */
function Raynote(id) {
    this._baseNodeId = id;
    this._wrapPanels = null;
    this._lastTouchPanelId = null;
    this.toolbar = new Toolbar();
    this._init();

}

Raynote.prototype = {
    _init : function() {
        // 골격 Html을 구성한다.
        var base = '<header> <div class="pure-menu pure-menu-horizontal"> <ul class="pure-menu-list"> <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover"> <a href="#" id="current-format-block" class="ray pure-menu-link">제목1</a> <ul class="pure-menu-children"> <hr> <li class="pure-menu-item"><a href="#" class="ray format-block pure-menu-link" data-block-style-tag="<h2>"><h2>제목1</h2></a></li> <hr> <li class="pure-menu-item"><a href="#" class="ray format-block pure-menu-link" data-block-style-tag="<h3>"><h3>제목2</h3></a></li> <hr> <li class="pure-menu-item"><a href="#" class="ray format-block pure-menu-link" data-block-style-tag="<h4>"><h4>제목3</h4></a></li> <hr> <li class="pure-menu-item"><a href="#" class="ray format-block pure-menu-link" data-block-style-tag="<p>">본문</a></li> </ul> </li> <li class="pure-menu-item pure-menu-selected"><a id="font-bold" href="#" class="ray pure-menu-link">B</a></li> <li class="pure-menu-item pure-menu-selected"><a id="font-underline" href="#" class="ray pure-menu-link"><u>U</u></a></li> <li class="pure-menu-item pure-menu-selected"><a href="#" class="pure-menu-link">C</a></li> <li class="pure-menu-item pure-menu-selected"> <div class="filebox"> <label for="image-upload">Image</label> <input type="file" name="file" title="이미지" accept="image/*" id="image-upload" multiple> </div> </li> <li class="pure-menu-item pure-menu-selected"> <div class="filebox"> <label for="ex_file">Grid-Image</label> <input type="file" id="ex_file" multiple> </div> </li> </ul> </div> </header> <div class="ray wrap-panels text-align-left" contenteditable="true"> </div>';
        jQuery(this._baseNodeId).append(base);

        var that = this;
        this._createNode();
        this._listenEvent();
        this.toolbar.listenEvent(function(tag) {
            that._applyFormatBlock(tag);
        });

        return this;
    },
    _createNode : function() {
        console.log('Raynote::_createNode()');
        if (this._wrapPanels === null) {
            this._wrapPanels = jQuery(this._baseNodeId + ' .wrap-panels');
        }
        return this;
    },
    // 커서가 마지막으로 위치했던 .ray.item을 기록한다.
    _findLastTouchPanelId : function() {
        var node = jQuery(window.getSelection().getRangeAt(0).startContainer.parentNode);
        var nodeTagName = node.get(0).tagName;
        while (nodeTagName == 'B' || nodeTagName == 'U' || nodeTagName == 'SPAN') {
            node = node.parent();
            nodeTagName = node.get(0).tagName;
        }
        var type = node.data('item-type');
        if(type) {
            this._lastTouchPanelId = node.attr('id');
            console.log('---------------- '+this._lastTouchPanelId);
        }
    },
    _listenEvent : function() {
        var that = this;
        console.log('Raynote::_listenEvent()');
        jQuery('#image-upload').on('change', function() {
            console.log('#image-upload change');

            // 이미지 아이템이 삽입될 위치를 구한다.
            // 1. 마지막으로 커서가 위치했던 엘레멘트의 다음 엘레멘트를 찾는다.
            // 2-1. 다음 엘레멘트가 있다면 해당 엘레멘트의 아이디를 최종 id로 사용한다.
            // 2-2. 다음 엘레멘트가 없다면 최종 id를 0으로 한다.
            var beforePanelId = 0;
            if (that._lastTouchPanelId) {
                var nextNode = jQuery('#'+that._lastTouchPanelId).next();
                var type = nextNode.data('item-type');
                if(type) {
                    beforePanelId = nextNode.attr('id');
                }
            }

            var files = !!this.files ? this.files : [];
            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

    		var imgList = new Array(files.length);
    		for( var i=0; i<files.length; i++) {
    			var file = files[i];
    			if (/^image/.test( file.type)){ // only image file
                    var panel = new ImagePanel(that._wrapPanels.width(), file);
                    that.appendPanel(panel, beforePanelId);
    			}
    		}
        });

        this._wrapPanels.keyup(function(event) {
            that._findLastTouchPanelId();

            // 엔터키 입력시
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                that._updateNewTextItemId();
            }
        });
        this._wrapPanels.click(function() {
            that._findLastTouchPanelId();

            // text 아이템 클릭시 해당 formatBlock을 조사하여
            // 메뉴의 값을 변경한다.
            that._updateFormatBlockText();
        });

        return this;
    },
    _updateFormatBlockText : function() {
        var node = jQuery(window.getSelection().getRangeAt(0).startContainer.parentNode);
        var nodeTagName = node.get(0).tagName;
        while (nodeTagName == 'B' || nodeTagName == 'U' || nodeTagName == 'SPAN') {
            node = node.parent();
            nodeTagName = node.get(0).tagName;
        }
        var type = node.data('item-type');
        if(type == 'text') {
            console.log('----- tagName:'+nodeTagName);
            if (nodeTagName == 'H2') {
                jQuery('#current-format-block').text('제목1');
            }
            else if (nodeTagName == 'H3') {
                jQuery('#current-format-block').text('제목2');
            }
            else if (nodeTagName == 'H4') {
                jQuery('#current-format-block').text('제목3');
            }
            else if (nodeTagName == 'P') {
                jQuery('#current-format-block').text('본문');
            }
        }
    },
    // 엔터키를 통해서 새로운 text 아이템이 생성되면 중복되는 id를
    // 새로운 id로 변경한다.
    _updateNewTextItemId : function() {
        var nodes = this._getSelectedElements();
        if (nodes.length == 1) {
            var node = nodes[0];
            if (node.data('item-type') == 'text') {
                // text 아이템상에서 엔터로 새로운 text 아이템이 생성되면
                // 새로 생성된 아이템의 id를 변경(기존의 아이템과 겹치니까)해준다.
                var nextNode = node.next();
                nextNode.attr('id', common.generateId());
            }
            console.log(node);
        }
    },
    _getSelectedElements : function() {
        var selObj = window.getSelection();
        if (selObj.rangeCount === 0) { return []; }
        console.log(selObj);
        var range  = selObj.getRangeAt(0);
        var start = range.startContainer.parentNode;
        var end = range.endContainer.parentNode;
        var nodes = [];
        var started = false;
        // 선택된 텍스트에 underline이나 bold 테그로 감싸졌을때의
        // 예외처리
        console.log(start);
        var startNode = jQuery(start);
        var startNodeTagName = startNode.get(0).tagName;
        console.log(startNodeTagName);
        while (startNodeTagName == 'B' || startNodeTagName == 'U' || startNodeTagName == 'SPAN') {
            startNode = startNode.parent();
            startNodeTagName = startNode.get(0).tagName;
        }

        var endNode = jQuery(end);
        var endNodeTagName = endNode.get(0).tagName;
        console.log(endNodeTagName);
        while (endNodeTagName == 'B' || endNodeTagName == 'U' || endNodeTagName == 'SPAN') {
            endNode = endNode.parent();
            endNodeTagName = endNode.get(0).tagName;
        }
        console.log(startNode);
        console.log(endNode);
        this._wrapPanels.children().each(function() {
            var node = jQuery(this);
            console.log(node);
            if (started) {
                nodes.push(node);
            }
            else {
                if (startNode.attr('id') == node.attr('id')) {
                    nodes.push(node);
                    started = true;
                }
            }

            if (endNode.attr('id') == node.attr('id')) {
                return false;
            }
        });

        console.log(nodes);
        return nodes;
    },
    _applyFormatBlock : function(tag) {
        var nodes = this._getSelectedElements();
        for (var i in nodes) {
            var node = nodes[i];
            console.log(nodes[i]);
            if (node.data('item-type') != 'text') {
                continue;
            }
            var newNode = jQuery(tag);
            var attrs = node.attr();
            for (var key in attrs) {
                console.log(key);
                newNode.attr(key, attrs[key]);
            }
            newNode.html(node.html());
            console.log(newNode);
            node.before(newNode);
            node.remove();
        }
    },
    appendBlankTextPanel : function(beforePanelId) {
        console.log('Raynote::appendBlankTextPanel()');
        var panel = new TextPanel('');
        this.appendPanel(panel, beforePanelId);
    },
    // beforePanelId :  앞 패널 id.
    //              id가 0이면 노드가 존재하지 않는 것이다.
    appendPanel : function(panel, beforePanelId) {
        var that = this;

        console.log('Raynote::appendPanel', beforePanelId);
        var node = panel.getNode();
        if(beforePanelId === 0) {
            this._wrapPanels.append(node);
        }
        else {
            var id = '#'+beforePanelId;
            jQuery(id).before(node);
        }

        panel.listenEvent(function(beforePanelId) {
            console.log('beforePanelId:'+beforePanelId);
            that.appendBlankTextPanel(beforePanelId);
        });

        node.trigger('focus');



        return this;
    }
};

/*
 Toolbar
 */
function Toolbar() {
    this._init();
}

Toolbar.prototype = {
    _init : function() {
        return this;
    },
    listenEvent : function(callback) {
        var that = this;
        jQuery('.ray.format-block').click(function(e) {
            var node = jQuery(e.currentTarget);
            var tag = node.data('block-style-tag');
            callback(tag);
        });
        jQuery('.ray#font-bold').click(function() {
            that._applyBold();
        });
        jQuery('.ray#font-underline').click(function() {
            that._applyUnderline();
        });
        return this;
    },
    _saveSelection : function() {
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var ranges = [];
                console.log('sel.rangeCount:'+sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    ranges.push(sel.getRangeAt(i));
                }
                return ranges;
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    },
    _restoreSelection : function(savedSel) {
        console.log(savedSel);
        if (savedSel) {
            if (window.getSelection) {
                sel = window.getSelection();
                sel.removeAllRanges();
                for (var i = 0, len = savedSel.length; i < len; ++i) {
                    sel.addRange(savedSel[i]);
                }
            } else if (document.selection && savedSel.select) {
                savedSel.select();
            }
        }
    },
    _applyBold : function() {
        this._restoreSelection(this._saveSelection());
        document.execCommand("bold", false, null);
        return this;
    },
    _applyUnderline : function() {
        this._restoreSelection(this._saveSelection());
        document.execCommand("underline", false, null);
        return this;
    }
};


/*
 Panel
 */
function Panel() {
    this._defaultHtml = null;
    this._node = null;
    this._init();
}

Panel.prototype = {
    _init : function() {
        console.log('Panel._init');
        return this;
    },
    listenEvent : function(callback) {
        var that = this;
        console.log('Panel::_listenEvent()');
        // 클릭 위치가 패널 상단의 공백 부분일 경우
        // 상단에 text 아이템을 추가한다.
        // 단, 상단에 이미 text 아이템이 존재할 경우 추가 안한다.
        this._node.on('click', function(e) {
            var paddingTop = parseInt(that._node.css('padding-top'));
            var parentPosition = that._getPosition(e.currentTarget);
            var y = e.clientY - parentPosition.y;
            console.log(parentPosition.y, y, e.clientY);
            if (y < paddingTop) {
                console.log('y < paddingTop');
                callback(that._node.attr('id'));
            }
        });
    },
    _getPosition : function(element) {
        var xPosition = 0;
        var yPosition = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    },
    getNode : function() {
        // 노드가 사용되는 시점에 jQuery 객체를 생성한다.
        if (this._node === null) {
            this._createNode();
        }

        return this._node;
    }
};

/*
 ImagePanel
 */
function ImagePanel(wrapPanelsWidth, file) {
    this._wrapPanelsWdith = wrapPanelsWidth;
    this._file = file;
    this._init();
}

ImagePanel.prototype = new Panel();
ImagePanel.prototype._init = function() {
    console.log('ImagePanel::_init()');
    this._defaultHtml = '<div class="ray item image" data-item-type="picture" contenteditable="false">';
    return this;
};
ImagePanel.prototype._load = function() {
    var that = this;
    console.log('ImagePanel::_load()');
    var reader = new FileReader();
    var imgElement = document.createElement('img');
    reader.onloadend = (function(img) {
        return function(e) {
            console.log(e);
            //console.log(e.target.result);
            img.src = e.target.result;
            /*
            img.onload = function() {
                console.log(img);
            };
            */
            that._resizeImage();
            console.log('img:'+img);
            console.log(jQuery(img));

        };
    })(imgElement);
    reader.readAsDataURL(this._file);
    this._node.append(imgElement);
    return this;
};
ImagePanel.prototype._resizeImage = function() {
    console.log('ImagePanel::_resizeImage()');
    var maxWidth = this._wrapPanelsWdith;
    var imgNode = this._node.children();
    var width = imgNode.width();
    var height = imgNode.height();
	var ratio = 0;
	if(width > maxWidth) {
		ratio = maxWidth / width;
		width = maxWidth;
		height = height * ratio;
	}

    imgNode.width(width);
    imgNode.height(height);

	return this;
};
ImagePanel.prototype._createNode = function() {
    console.log('TextPanel::_createNode');
    this._node = jQuery(this._defaultHtml);
    this._node.attr("id", common.generateId());
    this._load();

    return this;
};


/*
 TextPanel
 */
function TextPanel(textData) {
    this._textData = textData;
    this._init();
}

TextPanel.prototype = new Panel();
TextPanel.prototype._init = function() {
    console.log('TextPanel._init');
    this._defaultHtml = '<p class="ray item text" data-item-type="text" contenteditable="true"></p>';
    return this;
};
TextPanel.prototype._createNode = function() {
    console.log('TextPanel::_createNode');
    this._node = jQuery(this._defaultHtml);
    if (this._textData) {
        this._node.text(this._textData);
    }
    else {
        var brElement = document.createElement('br');
        this._node.append(brElement);
    }
    this._node.attr("id", common.generateId());
    return this;
};

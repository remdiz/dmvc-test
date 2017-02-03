(function() {

    var root = this,
        dMVC = root.dMVC || {};

    dMVC.Vidgets = {};

    dMVC.Vidgets.Icon = dMVC.View.subClass({

        _preConstruct: function (name) {
            var opt = {};
            opt.htmlTag = 'span';
            opt.class = 'glyphicon glyphicon-' + name;
            opt.attrs = {'aria-hidden': true};
            this._super(opt);

        }

    });

    dMVC.Vidgets.DropDown = dMVC.View.subClass({

        _preConstruct: function (options) {
            var opt = {};

            opt.class = options.direction == 'up' ? 'dropup' : 'dropdown';
            this._super(opt);
            var ul = new dMVC.View({
                htmlTag: 'ul',
                class: 'dropdown-menu'
            });
            this._listCid = ul.cid;
            var button = new dMVC.View({
                htmlTag: 'button',
                html: options.title,
                class: 'btn btn-default dropdown-toggle',
                attrs: {
                    'type': 'button'
                },
                events: {
                    click: function() {
                        //duration - 'fast' | 'slow' | {Number}
                        ul.$element.toggle(options.duration);
                    }
                }
            });
            var caret = new dMVC.View({
                htmlTag: 'span',
                class: 'caret'
            });
            button.add(caret);
            this.add(button);

            this.add(ul);
            $(document.body).click(function() {
                ul.$element.hide(options.duration);
            });
        },

        addHeader: function(text) {
            var ul = this.children[this._listCid];
            var li = new dMVC.View({
                htmlTag: 'li',
                html: text,
                class: 'dropdown-header'
            });
            ul.add(li);
        },

        addDivider: function() {

            var ul = this.children[this._listCid];
            var li = new dMVC.View({
                htmlTag: 'li',
                class: 'divider',
                attrs: {
                    'role': 'separator'
                }
            });
            ul.add(li);

        },

        addItem: function(item) {

            var ul = this.children[this._listCid];
            var li = new dMVC.View({
                htmlTag: 'li',
                class: item.disabled ? 'disabled' : null
            });
            var a = new dMVC.View({
                htmlTag: 'a',
                attrs: {
                    'href': item.disabled ? '#' : item.href || '#'
                },
                html: item.text,
                events: item.click && !item.disabled ? {click: item.click} : null,
                context: item.context || null
            });
            if(item.icon) {
                var icon = new dMVC.Vidgets.Icon(item.icon);
                a.add(icon);
            }
            li.add(a);
            ul.add(li);

        }

    });

    dMVC.Vidgets.ButtonGroup = dMVC.View.subClass({

        _preConstruct: function (options) {
            options = options || {};
            var opt = {};
            var groupClass = 'btn-group';
            if(options.vertical) {
                groupClass += '-vertical';
            }
            if(options.size) {
                groupClass += ' ' + 'btn-group-' + options.size;
            }
            if(options.justified) {
                this._justified = true;
                groupClass += ' ' + 'btn-group-justified';
            }
            opt.class = groupClass;
            opt.attrs = {'role': 'group', 'aria-label': 'button-group'};
            this._super(opt);
        },

        addItem: function(item) {
            console.log('addItem: ', item);
            //its possible to add DropDown to group
            if(item instanceof dMVC.Vidgets.DropDown) {
                this.addDropDown(item);
                return;
            }
            var button = new dMVC.View({
                htmlTag: 'button',
                class: 'btn btn-default',
                html: item.title
            });
            if(this._justified) {
                var outerGroup = new dMVC.Vidgets.ButtonGroup();
                outerGroup.add(button);
                this.add(outerGroup);
            } else {
                this.add(button);
            }
        },

        addDropDown: function(drop) {
            drop.$element.removeClass('dropup dropdown');
            drop.$element.addClass('btn-group');
            drop.$element.attr('role', 'group');

            if(this._justified) {
                var outerGroup = new dMVC.Vidgets.ButtonGroup();
                outerGroup.add(drop);
                this.add(outerGroup);
            } else {
                this.add(drop);
            }
        }

    });

    dMVC.Vidgets.ButtonToolbar = dMVC.View.subClass({

        _preConstruct: function (options) {
            var opt = {};
            opt.class = 'btn-toolbar';
            opt.attrs = {'role': 'toolbar', 'aria-label': 'button-toolbar'};
            this._super(opt);
        },

        addItem: function(item) {
            this.add(item);
        }

    });

})(this);

(function() {

    /**
     * Powered by http://getbootstrap.com/
     */

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

        /**
         * Pre-constructor
         * @param options {Object} direction - up or down(default),
         * title - button title, duration - animation time
         * @private
         */
        _preConstruct: function (options) {
            var opt = {};

            if(options.navBar) {
                this.createNavDrop(options);
                return;
            }

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

        createNavDrop: function(options) {

            var opt = {};

            opt.class = 'dropdown';
            opt.htmlTag = 'li';
            this._super(opt);
            var ul = new dMVC.View({
                htmlTag: 'ul',
                class: 'dropdown-menu'
            });
            this._listCid = ul.cid;
            var a = new dMVC.View({
                htmlTag: 'a',
                html: options.title,
                class: 'dropdown-toggle',
                attrs: {
                    'href': '#'
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
            a.add(caret);
            this.add(a);

            this.add(ul);
            $(document.body).click(function() {
                ul.$element.hide(options.duration);
            });

        },

        /**
         * Add a header to label sections of actions
         * @param text {String}
         */
        addHeader: function(text) {
            var ul = this.children[this._listCid];
            var li = new dMVC.View({
                htmlTag: 'li',
                html: text,
                class: 'dropdown-header'
            });
            ul.add(li);
        },

        /**
         * Add a divider to separate series of links
         */
        addDivider: function() {

            var ul = this.children[this._listCid];
            var li = new dMVC.View({
                htmlTag: 'li',
                class: 'divider'
            });
            ul.add(li);

        },

        /**
         * Add menu item
         * @param item {Object} disabled - inactive item, href - item hyperlink('#' default),
         * text - item title, click - we can pass a callback here, context - callback context,
         * icon - dMVC.Vidgets.Icon name
         */
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

        /**
         * Pre-constructor
         * @param options {Object} vertical - creates vertical group, size - 'lg', 'sm', 'xs',
         * justified - makes a group of buttons stretch at equal sizes to span the entire width of its parent
         * @private
         */
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
            //opt.attrs = {'role': 'group', 'aria-label': 'button-group'};
            this._super(opt);
        },

        /**
         * Add button or dropdown
         * @param item {Object || dMVC.Vidgets.DropDown} title - button title
         */
        addItem: function(item) {

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

        /**
         * Add dropdown to group
         * @param drop {dMVC.Vidgets.DropDown}
         */
        addDropDown: function(drop) {
            drop.$element.removeClass('dropup dropdown');
            drop.$element.addClass('btn-group');
            //drop.$element.attr('role', 'group');

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
            //opt.attrs = {'role': 'toolbar', 'aria-label': 'button-toolbar'};
            this._super(opt);
        },

        addItem: function(item) {
            this.add(item);
        }

    });

    dMVC.Vidgets.Table = dMVC.View.subClass({

        /**
         * Pre-constructor
         * adds thead & tbody to table,
         * creates structure field in this, containing head & body cids to simplify access to them
         * @param options {Object}
         * striped - zebra-striping, bordered - adds borders, hover - enables a hover state on table rows,
         * condensed - makes table more compact
         * @private
         */
        _preConstruct: function (options) {
            options = options || {};
            var opt = {};
            opt.htmlTag = 'table';
            opt.class = 'table';
            if(options.striped) {
                opt.class += ' table-striped';
            }
            if(options.bordered) {
                opt.class += ' table-bordered';
            }
            if(options.hover) {
                opt.class += ' table-hover';
            }
            if(options.condensed) {
                opt.class += ' table-condensed';
            }
            this._super(opt);
            var head = new dMVC.View({
                htmlTag: 'thead'
            });
            var body = new dMVC.View({
                htmlTag: 'tbody'
            });
            this.add(head);
            this.add(body);
            this.structure = {
                thead: head.cid,
                tbody: body.cid
            };
        },

        /**
         * Add row
         * @param row {Object} head - adds row to thead, type - contextual classes to color table rows
         * cells - array td`s: {content: cell text, type: cell contextual class}
         */
        addRow: function (row) {
            var tr = new dMVC.View({
                htmlTag: 'tr',
                class: row.type || ''
            });
            _.each(row.cells, function (cell) {
                var td = new dMVC.View({
                    htmlTag: row.head ? 'th' : 'td',
                    html: cell.content,
                    class: cell.type || ''
                });
                tr.add(td);
            });
            var container = row.head ? this.children[this.structure.thead] : this.children[this.structure.tbody];
            container.add(tr);
        }

    });

    //TODO: input groups http://getbootstrap.com/components/#input-groups
    dMVC.Vidgets.Form = dMVC.Basic.Form.subClass({

        /**
         * Pre-constructor
         * @param options {Object} type - horizontal(default) or inline form layout
         * @private
         */
        _preConstruct: function (options) {
            options = options || {};
            var opt = {};
            var type = options.type || 'horizontal';
            opt.class = 'form-' + type;
            this._super(opt);
        },

        /**
         * Add form field (wraps input element into div.form-group)
         * @param element {dMVC.Vidgets.Input}
         * @param opt {Object} label - add label to input,
         */
        addElement: function(element, opt) {

            opt = opt || {};
            var group = new dMVC.View({
                class: 'form-group'
            });
            if(opt.label) {
                var lTag = new dMVC.View({
                    htmlTag: 'label',
                    html: opt.label.title
                });
                lTag.add(element);
                group.add(lTag);
                this.add(group);
            } else {
                group.add(element);
                this.add(group);
            }

        }

    });

    dMVC.Vidgets.Input = dMVC.Basic.Input.subClass({

        /**
         * Pre-constructor
         * @param opt {Object} add opt.class to prevent adding .form-control class to input (useful in case of submit field)
         * @private
         */
        _preConstruct: function (opt) {
            opt = opt || {};
            opt.class = opt.class || 'form-control';
            this._super(opt);
        }

    });

    /**
     * http://getbootstrap.com/components/#nav
     */
    dMVC.Vidgets.Nav = dMVC.View.subClass({

        /**
         * Pre-constructor
         * @param options {Object} type - 'tabs'(default), 'pills';
         * vertical - vertical orientation (for pills only),
         * justified - make tabs or pills equal widths of their parent
         * @private
         */
        _preConstruct: function (options) {
            options = options || {};
            var opt = {};
            var type = options.type || 'tabs';
            opt.htmlTag = 'ul';
            opt.class = 'nav nav-' + type;
            if(options.vertical) {
                opt.class = 'nav nav-pills nav-stacked';
            }
            if(options.justified) {
                opt.class += '  nav-justified';
            }
            this._super(opt);
        },

        /**
         * Add navigation item
         * @param item {Object || dMVC.Vidgets.DropDown} active - set active item,
         * disabled - disables item, href - items hyperlink,
         * title - item text
         */
        addItem: function(item) {

            if(item instanceof dMVC.Vidgets.DropDown) {
                this.addDropDown(item);
            }

            var self = this;
            var liClass = item.active ? 'active' : '';
            if(item.disabled) {
                liClass += ' disabled';
            }
            var li = new dMVC.View({
                htmlTag: 'li',
                class: liClass
            });
            var a = new dMVC.View({
                htmlTag: 'a',
                attrs: {
                    'href': item.disabled ? '#' : item.href || '#'
                },
                events: {
                    click: function(evt) {
                        self.setActive(li.cid);
                    }
                },
                context: self,
                html: item.title
            });
            li.add(a);
            this.add(li);

        },

        /**
         * Add DropDown to Nav
         * @param drop {dMVC.Vidgets.DropDown}
         */
        addDropDown: function(drop) {
            var li = new dMVC.View({
                htmlTag: 'li'
            });
            li.add(drop);
            this.add(li);
        },

        /**
         * Set active item
         * @param cid {String} - item id
         */
        setActive: function(cid) {

            var li = this.children[cid];
            if(li.$element.hasClass('disabled'))
                return;
            _.each(this.children, function(child) {
                if(child.cid == cid) {
                    child.$element.addClass('active');
                } else {
                    child.$element.removeClass('active');
                }

            });
        }

    });

    /**
     * http://getbootstrap.com/components/#navbar
     */
    dMVC.Vidgets.Navbar = dMVC.View.subClass({

        /**
         * Pre-constructor
         * @param options {Object} form - form element placement: 'left'(default) || 'right',
         * inverse - black style bar
         * @private
         */
        _preConstruct: function (options) {
            options = options || {};
            var opt = {};
            opt.htmlTag = 'nav';
            opt.class = options.inverse ? 'navbar navbar-inverse' : 'navbar navbar-default';

            this._super(opt);
            var container = new dMVC.View({
                class: 'container-fluid'
            });
            var header = new dMVC.View({
                class: 'navbar-header'
            });
            var collapsed = new dMVC.View({
                class: 'collapse navbar-collapse'
            });

            var left = new dMVC.View({
                htmlTag: 'ul',
                class: 'nav navbar-nav'
            });
            var form = new dMVC.View({
                htmlTag: 'form',
                events: {
                    "submit": this.formSubmitted
                },
                context: this,
                class: 'navbar-form navbar-' + options.form || 'left'
            });
            var right = new dMVC.View({
                htmlTag: 'ul',
                class: 'nav navbar-nav navbar-right'
            });
            collapsed.add(left);
            collapsed.add(right);
            collapsed.add(form);
            this._structure = {
                nav: collapsed.cid,
                header: header.cid,
                left: left.cid,
                form: form.cid,
                right: right.cid
            };

            container.add(header);
            container.add(collapsed);
            this.add(container);
        },

        addText: function(text) {

            var container = this.find(this._structure.nav);
            var p = new dMVC.View({
                htmlTag: 'p',
                html: text,
                class: 'navbar-text'
            });
            container.add(p);

        },

        /**
         * Nav form submit callback
         * @param evt {Object} event
         * @returns {boolean}
         */
        formSubmitted: function(evt) {
            //console.log('formSubmitted: ', this, arguments);
            return false;
        },

        /**
         * Add title to NavBar
         * @param opt {Object} title - text,
         * img - set image as title
         * @param callback {Function}
         */
        addHeader: function(opt, callback) {

            var a = new dMVC.View({
                htmlTag: 'a',
                attrs: {
                    'href': '#'
                },
                events: callback ? {"click": callback} : null,
                html: opt.img ? '' : opt.title,
                class: 'navbar-brand'
            });
            var head = this.find(this._structure.header);
            if(opt.img) {
                var image = new dMVC.View({
                    htmlTag: 'img',
                    attrs: {
                        'src': opt.img,
                        'alt': opt.title
                    }
                });
                a.add(image);
            }
            head.add(a);

        },

        /**
         * Add form to NavBar (search or something else)
         * @param item {Object} inputText - input placeholder,
         * buttonText - button title (default - Submit)
         */
        addForm: function(item) {

            var container = this.find(this._structure.form);
            var div = new dMVC.View({
                class: 'form-group'
            });
            var input = new dMVC.View({
                htmlTag: 'input',
                attrs: {
                    'type': 'text',
                    'placeholder': item.inputText
                },
                class: 'form-control'
            });
            var button = new dMVC.View({
                htmlTag: 'button',
                attrs: {
                    'type': 'submit',
                    'placeholder': item.inputText
                },
                html: item.buttonText || 'Submit',
                class: 'btn btn-default'
            });
            div.add(input);
            container.add(div);
            container.add(button);

        },

        /**
         * Add NavBar item
         * @param item {Object || dMVC.Vidgets.DropDown} (in case of DropDown we should create it with 'navBar' parameter)
         * direction - 'left'(default) or 'right' side of navBar,
         * active - sets active item, href - items hyperlink, title - item text
         * @param callback {Function} - set 'click' action on item
         */
        addItem: function(item, callback) {

            var direction = item.direction || 'left',
                container = this.find(this._structure[direction]/*.left*/),
                self = this;

            if(item instanceof dMVC.Vidgets.DropDown) {
                //this.addDropDown(item, container);
                container.add(item);
                return;
            }

            var li = new dMVC.View({
                htmlTag: 'li',
                class: item.active ? 'active' : ''
            });

            var a = new dMVC.View({
                htmlTag: item.button ? 'button' : 'a',
                attrs: {
                    'href': item.href || '#'
                },
                class: item.button ? 'btn btn-default navbar-btn' : '',
                events: {
                    click: function(evt) {
                        self.$element.find('li.active').removeClass('active');
                        li.$element.addClass('active');
                        if(callback)
                            callback(evt);
                    }
                },
                html: item.title
            });
            li.add(a);
            container.add(li);

        }
    });

    /**
     * http://getbootstrap.com/components/#breadcrumbs
     */
    dMVC.Vidgets.Breadcrumb = dMVC.Basic.List.subClass({

        _preConstruct: function (options) {
            var opt = {};
            opt.htmlTag = 'ol';
            opt.class = 'breadcrumb';
            this._super(opt);
        },

        addItem: function(item, callback) {
            var li = new dMVC.View({
                htmlTag: 'li',
                class: item.active ? 'active' : '',
                html: item.active ? item.text : ''
            });
            if(!item.active) {
                var a = new dMVC.View({
                    htmlTag: 'a',
                    attrs: {
                        'href': '#'
                    },
                    events: callback ? {click: callback} : null,
                    html: item.text
                });
                li.add(a);
            }

            this.add(li);
        }

    });

})(this);

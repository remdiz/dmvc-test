(function() {
    var root = this,
        dMVC = root.dMVC || {};

    dMVC.Basic = {};


    dMVC.Basic.List = dMVC.View.subClass({

        _preConstruct: function (opt) {
            opt = opt || {};
            opt.htmlTag = opt.htmlTag || 'ul';
            this._super(opt);
        },

        addItem: function(text) {
            var li = new dMVC.View({
                htmlTag: 'li',
                html: text
            });
            this.add(li);
        },

        removeItem: function(item) {

            if(_.isNumber(item)) {
                var ids = _.keys(this.children);
                this.remove(ids[item]);
            } else if(_.isString(item)) {
                var found = _.find(this.children, function(child) {
                    return child.$element.html() == item;

                });
                if(found) {
                    this.remove(found);
                }

            }

        }

    });

    dMVC.Basic.Form = dMVC.View.subClass({

        events: {
            "submit": "formSubmit"
        },

        formSubmit: function(evt) {

            //console.log(evt, this);
            return false;

        },

        _preConstruct: function (opt) {
            opt = opt || {};
            opt.htmlTag = 'form';
            this._super(opt);
        },

        /**
         * Add form field
         * @param element {dMVC.Basic.Input}
         * @param opt {Object} label - add label to input, br - add <br> tag after input
         */
        addElement: function(element, opt) {

            opt = opt || {};
            if(opt.label) {
                var lTag = new dMVC.View({
                    htmlTag: 'label',
                    html: opt.label.title
                });
                lTag.add(element);
                this.add(lTag);
            } else {
                this.add(element);
            }
            if(opt.br) {
                var br = new dMVC.View({
                    htmlTag: 'br'
                });
                this.add(br);
            }

        }

    });

    dMVC.Basic.Input = dMVC.View.subClass({

        events: {
            "change": "valueChanged"
        },

        _preConstruct: function (opt) {
            opt = opt || {};
            opt.htmlTag = opt.htmlTag || 'input';
            this._super(opt);
        },

        valueChanged: function(evt) {

            //console.log(evt, this);

        },

        /**
         * Add options to <select> field
         * @param option {Object} title - option name, header - select field title (would be disabled & displayed on top of the options)
         */
        addOption: function(option) {

            var optionTag = new dMVC.View({
                htmlTag: 'option',
                html: option.title,
                attrs: {
                    value: option.value,
                    disabled: option.header,
                    selected: option.header
                }
            });
            this.add(optionTag);

        }

    });

})(this);
(function() {
    var root = this,
        dMVC = root.dMVC || {};

    dMVC.Basic = {};

    dMVC.Basic.List = dMVC.View.subClass({

        ASC_ORDER: 1,
        DESC_ORDER: 2,

        //pre-constructor
        _preConstruct: function (opt) {
            opt = opt || {};
            this.items = [];
            this.$container = $(opt.container || document.body);
            this._super(opt);
        },

        //constructor
        init: function(opt) {
            this.render();
        },

        addItem: function(item) {

            this.items.push(text);
            var $li = $("<li>" + text + "</li>");
            this.$element.append($li);

        },

        sort: function(order) {

            if(order == this.DESC_ORDER) {
                this.items.reverse();
            } else {
                this.items.sort();
            }
            this.$element.html('');
            this.render();

        },

        filter: function() {

        },

        /**
         * Remove from list
         * @param item {String | Number}
         */
        removeItem: function(item) {

            if(_.isString(item)) {
                this.$element.find(':contains("'+ item + '")').remove();
                this.items = _.without(this.items, item);
            } else if(_.isNumber(item) && this.items.length > item) {
                this.$element.find('li')[item].remove();
                this.items.splice(item, 1);
            }

        },

        render: function() {
            _.each(this.items, function(item) {
                var li = $("<li>" + item + "</li>");
                this.$element.append(li);
            }, this);
            this.$container.append(this.$element);
        }

    });

})(this);
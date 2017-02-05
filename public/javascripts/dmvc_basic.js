(function() {
    var root = this,
        dMVC = root.dMVC || {};

    dMVC.Basic = {};

    dMVC.Basic.List = dMVC.View.subClass({

        ASC_ORDER: 1,
        DESC_ORDER: 2,


        _preConstruct: function (options) {
            var opt = {};
            opt.htmlTag = options.type || 'ul';
            this._super(opt);
        },

        //constructor
        init: function(opt) {
            //this.render();
        },

        addItem: function(item) {

            var li = new dMVC.View({htmlTag: 'li', html: item});
            this.add(li);

        },

        sort: function(order) {

            /*if(order == this.DESC_ORDER) {
                this.items.reverse();
            } else {
                this.items.sort();
            }
            this.$element.html('');
            this.render();*/

        },

        filter: function() {

        },

        /**
         * Remove from list
         * @param item {String | Number}
         */
        removeItem: function(item) {

            /*if(_.isString(item)) {
                this.$element.find(':contains("'+ item + '")').remove();
                this.items = _.without(this.items, item);
            } else if(_.isNumber(item) && this.items.length > item) {
                this.$element.find('li')[item].remove();
                this.items.splice(item, 1);
            }*/

        }


    });

    dMVC.Basic.Input = dMVC.View.subClass({

        _preConstruct: function (options) {
            var opt = {};
            opt.htmlTag = options.type || 'input';
            this._super(opt);
        },

    });

})(this);
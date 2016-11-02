var dMVC = {};

dMVC.View = function(view) {

    _.each(view, function(val, key) {
        this[key] = val;
    }, this);

};

dMVC.View.prototype = {



};

dMVC.Client = function(url) {

    this.url = url || '/get_views';
    this.views = [];

};

dMVC.Client.prototype = {

    fetchViews: function() {

        var self = this;
        $.get(this.url, function(data) {
            console.log('data: ', data);
            _.each(data, function(view) {
                console.log('Each: ', view);
                this.views.push(new dMVC.View(view));
            }, self);

        });


    }

};

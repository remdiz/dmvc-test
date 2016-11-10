(function () {

    var dMVC;

    dMVC = this.dMVC = {};

    dMVC.View = function(model, ctrl) {

        _.extend(this, model);
        this.controller = ctrl;

    };

    dMVC.View.prototype = {

        markup: '<li></li>',

        render: function ($container) {
            var $link = $('<span> X</span>');
            $link.click({self: this.controller, view: this}, this.controller.remove);
            this.$element = $(this.markup).html(this.task).append($link);
            $container.append(this.$element);
        },

        remove: function () {

            this.$element.remove();

        }

    };



    dMVC.ViewController = function() {

        this.views = [];    //TODO: use some type of Collection??

    };

    dMVC.ViewController.prototype = {

        remove: function(evt) {
            var self = evt.data.self,
                view = evt.data.view;
            $.post('/del_task', {id: view.id}, function(resp) {
                console.log('Del task resp: ', resp);
                if(resp.removed) {
                    self.views = _.without(self.views, view);
                    view.remove();
                }
            }, 'json');
        },

        add: function (view) {

            var self = this;

            $.post('/add_task', {task: view}, function(data) {
                console.log('received: ', data);
                var added = new dMVC.View(data.model, self);
                added.render($("#tasks_block"));
                self.views.push(added);
            }, 'json');

        },

        fetch: function() {

            var self = this;
            $.get('/get_views', function(data) {
                console.log('data: ', data);
                _.each(data.models, function(view) {
                    //console.log('Each: ', view);
                    var added = new dMVC.View(view, self);
                    added.render($("#tasks_block"));
                    this.views.push(added);
                }, self);

            });


        }

    };

    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    dMVC.View.extend = dMVC.ViewController.extend = extend;

}).call(this);

/*

var dMVC = {};
dMVC.static = {};
dMVC.dynamic = {};

dMVC.dynamic.View = function(model) {

    _.extend(this, model);

};

dMVC.dynamic.View.prototype = {

    markup: '<li></li>',

    render: function ($container) {
        var $link = $('<span> X</span>');
        $link.click({self: this}, this.deleteTask);
        $container.append($(this.markup).html(this.task).append($link));
    },

    //this!
    deleteTask: function (evt) {

        var self = evt.data.self;
        $.post('/del_task', {id: self.id}, function(resp) {
            console.log('Del task resp: ', resp);
        }, 'json');
    }

};

dMVC.static.View = function(el) {

    this.$element = $("#" + el);
    this.subViews = [];

};

dMVC.static.View.prototype = {

    markup: '<form action="#" id="app_form"><label>New Task: <input type="text" id="add_task"></label><input type="submit"></form><ul id="tasks_block"></ul>',

    init: function() {

        this.$element.html(this.markup);
        this.$subElements = $("#tasks_block");
        $("#app_form").submit({self: this}, this.sendTask);

    },

    //this = form
    sendTask: function(evt) {
        var self = evt.data.self;
        $.post('/add_task', {task: $("#add_task").val()}, function(data) {
            console.log('received: ', data);
            var added = new dMVC.dynamic.View(data.model);
            added.render(self.$subElements);
            self.subViews.push(added);
        }, 'json');
        return false;
    }

};

dMVC.ViewController = function() {

    this.views = [];

};

dMVC.ViewController.prototype = {

    fetch: function() {

        var self = this;
        $.get('/get_views', function(data) {
            console.log('data: ', data);
            _.each(data, function(view) {
                console.log('Each: ', view);
                this.views.push(new dMVC.View(view));
            }, self);

        });


    }

};
*/

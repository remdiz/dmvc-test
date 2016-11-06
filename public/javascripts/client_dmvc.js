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

/*dMVC.Client = function(url) {

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

};*/

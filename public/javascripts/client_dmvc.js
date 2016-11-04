var dMVC = {};
dMVC.static = {};

dMVC.static.View = function(el) {

    this.$element = $("#" + el);

};

dMVC.static.View.prototype = {

    markup: '<form action="#" id="app_form"><label>New Task: <input type="text" id="add_task"></label><input type="submit"></form><div id="tasks_block"></div>',

    init: function() {

        this.$element.html(this.markup);
        $("#app_form").submit(this.sendTask);

    },

    //this = form
    sendTask: function() {
        $.post('/add_task', {task: $("#add_task").val()}, function(data) {
            console.log('received: ', data);
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

$(function() {

    var addTaskView = new dMVC.static.View('task_form');
    addTaskView.init();

    /*$("#app_form").submit(function() {
        //console.log(this);
        $.post('/add_task', {task: $("#add_task").val()}, function(data) {
            console.log('received: ', data);
        }, 'json');
        return false;
    });

    var client = new dMVC.Client();
    client.fetchViews();*/
});



/*
var menuView = new dMVC.client.View();

menuView.fetch(function(view) {
    view.render();
});*/

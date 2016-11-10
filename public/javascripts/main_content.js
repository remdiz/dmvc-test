$(function() {




    /*----------------------app-----------------*/
    /*var viewsController = new dMVC.ViewController();

    console.log('viewsController: ', viewsController);

    viewsController.fetch();*/


    var jqAdapter = function(selector) {
        this.$el = $(selector);
    };

    jqAdapter.prototype = {

        on: function(evtName) {
            this.$el.on(evtName, function(evt) {
                console.log('On ' + evtName, arguments);
                $.post('/events', {type: evt.type, targetID: evt.target.id}, function(data) {
                    console.log('Resp: ', data);
                });
                return false;
            });
        }

    };

    var $adapter = function(selector) {
        return new jqAdapter(selector);
    };
    console.log('Adapter: ', $adapter);

    //jqAdapter.id('app_form').on('submit');

    /*$("#app_form").submit(function() {

        //viewsController.add($("#add_task").val());

        $.post('/events', {name: 'submit', target: 'app_form', text: $("#add_task").val()}, function(data) {
            console.log('received: ', data);

        }, 'json');

        return false;
    });*/

});


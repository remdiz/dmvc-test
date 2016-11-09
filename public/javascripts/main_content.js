$(function() {


    var viewsController = new dMVC.ViewController();

    console.log('viewsController: ', viewsController);

    viewsController.fetch();


    $("#app_form").submit(function() {

        viewsController.add($("#add_task").val());

        return false;
    });

});


$(function () {
    var TaskView = dMVC.View.subClass({

        type: 'Task',

        init: function(opt) {

            this.done = opt.done;
            var span = new dMVC.View({
                htmlTag: 'span',
                html: ' X ',
                events: {
                    click: function() {
                        //console.log('click: ', this);
                        this.process('deleteTask');
                    }
                },
                context: this
            });
            this.add(span);

        }

    });

    var AppView = dMVC.View.subClass({

        type: 'App',

        commands: {
            "create": "createTask",
            "delete": "deleteTask"
        },

        events: {
            "submit": "formSubmit"
        },

        //constructor
        init: function(opt) {
            this.$inputField = this.$element.find("#add_task");
            //this.$element.submit({self: this}, this.formSubmit);
            this.process('getTasks');
            //parent method call
            //this._super(opt);
        },

        deleteTask: function (command) {

            this.remove(command.id);

        },

        createTask: function (command) {
            var task = new TaskView({
                html: command.text,
                done: command.done,
                htmlTag: 'li'
            });
            task.cid = command.id;
            this.add(task);
        },

        formSubmit: function(evt) {
            //var self = evt.data.self;
            this.process('createTask', this.$inputField.val());
            this.$inputField.val('');
            return false;
        }

    });

    var app = new AppView({el: '#app_form'});

    //var list = new dMVC.Basic.List({htmlTag: 'ul', container: document.body});
    var container = new dMVC.View({container: document.body});
    /*var drop = new dMVC.Vidgets.DropDown({title: 'test title', duration: 'fast'});
    drop.addHeader('header 1');
    drop.addItem({text: 'test item 1', click: clicked, context: container, icon: 'heart'});
    drop.addDivider();
    drop.addHeader('header 2');
    drop.addItem({text: 'test item 2', click: clicked, disabled: true});
    container.add(drop);
    function clicked() {
        console.log('test item clicked', this);
    }*/
    var group1 = new dMVC.Vidgets.ButtonGroup(/*{justified: true}*/);
    group1.addItem({title: 'Button 1'});
    group1.addItem({title: 'Button 2'});

    var drop = new dMVC.Vidgets.DropDown({title: 'test title', duration: 'fast'});
    drop.addHeader('header 1');
    drop.addItem({text: 'test item 1'});
    group1.addItem(drop);

    /*var group2 = new dMVC.Vidgets.ButtonGroup();
    group2.addItem({title: 'Button 3'});
    group2.addItem({title: 'Button 4'});
    var totalGroup = new dMVC.Vidgets.ButtonToolbar();
    totalGroup.addItem(group1);
    totalGroup.addItem(group2);*/

    container.add(group1);



    console.log('app view: ', app, group1);

    /*var ULView = dMVC.View.subClass({
        type: 'UL'
    });

    var LiView = dMVC.View.subClass({
        type: 'Li'
    });
    var ul = new ULView({htmlTag: 'ul', container: document.body});
    var li = new LiView({htmlTag: 'li', html: 'test li'});
    var p = new dMVC.View({
        htmlTag: 'p',
        html: 'test p ',
        events: {
            click: function() {console.log('p clicked');}
        }
    });
    li.add(p);
    ul.add(li);

    console.log('ul: ', ul, ' li: ', li, ' p: ', p);

    var obj = {
        title: 'Object Title',
        date: '12-08-2014 13:52:11',
        user: 12548,
        description: 'Object Description'
    };*/

});




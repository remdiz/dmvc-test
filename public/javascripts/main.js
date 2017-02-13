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

    //var container = new dMVC.View({el: '#tests'});
    /*var table = new dMVC.Vidgets.Table({hover: true, bordered: true});
    table.addRow({
        head: true,
        cells: [
            {content: 'id'},
            {content: 'head 1'},
            {content: 'head 2'}
        ]
    });
    table.addRow({
        cells: [
            {content: '1'},
            {content: 'test 2'},
            {content: 'test 3'}
        ]
    });
    table.addRow({
        type: 'warning',
        cells: [
            {content: '2'},
            {content: 'test 4'},
            {content: 'test 5'}
        ]
    });
    table.addRow({
        cells: [
            {content: '3'},
            {content: 'test 6'},
            {content: 'test 7', type: 'danger'}
        ]
    });*/

    /*var form = new dMVC.Vidgets.Form();
    var input  = new dMVC.Vidgets.Input({
        attrs: {
            type: 'text',
            name: 'test_input'
        }
    });
    var button = new dMVC.Vidgets.Input({
        class: 'btn btn-primary',
        attrs: {
            type: 'submit'
        }
    });
    var select = new dMVC.Vidgets.Input({
        htmlTag: 'select'
    });
    select.addOption({
        title: 'Choose value',
        header: true
    });
    select.addOption({
        title: 'option 1',
        value: 1
    });
    select.addOption({
        title: 'option 2',
        value: 2
    });
    form.addElement(input, {
        label: {
            title: 'Text input title: '
        }
    });
    form.addElement(select, {
        label: {
            title: 'Select title: '
        }
    });
    form.addElement(button);*/

    //container.add(form);

    /*var drop = new dMVC.Vidgets.DropDown({title: 'Left drop', duration: 'fast', navBar: true});
    drop.addHeader('header 1');
    drop.addItem({text: 'test item 1', click: clicked, icon: 'heart'});
    drop.addDivider();
    drop.addHeader('header 2');
    drop.addItem({text: 'test item 2', click: clicked, disabled: true});
    //container.add(drop);
    function clicked() {
        console.log('test item clicked', this);
    }*/

    /*var group1 = new dMVC.Vidgets.ButtonGroup();
    group1.addItem({title: 'Button 1'});
    group1.addItem({title: 'Button 2'});

    var drop = new dMVC.Vidgets.DropDown({title: 'test title', duration: 'fast'});
    drop.addHeader('header 1');
    drop.addItem({text: 'test item 1'});
    group1.addItem(drop);

    var group2 = new dMVC.Vidgets.ButtonGroup();
    group2.addItem({title: 'Button 3'});
    group2.addItem({title: 'Button 4'});
    var totalGroup = new dMVC.Vidgets.ButtonToolbar();
    totalGroup.addItem(group1);
    totalGroup.addItem(group2);

    container.add(group1);*/

    /*var nav = new dMVC.Vidgets.Nav({type: 'pills'});
    nav.addItem({title: 'item 1', disabled: true});
    nav.addItem({title: 'item 2', active: true});
    nav.addItem({title: 'item 3'});

    var drop = new dMVC.Vidgets.DropDown({title: 'test title', duration: 'fast'});
    drop.addHeader('header 1');
    drop.addItem({text: 'test item 1', icon: 'heart'});
    drop.addDivider();
    drop.addHeader('header 2');
    drop.addItem({text: 'test item 2', disabled: true});
    nav.addItem(drop);*/

    /*var navBar = new dMVC.Vidgets.Navbar({form: 'right', inverse: true});
    navBar.addHeader({title: 'Img'}, function() {
        console.log('Title pressed');
    });
    navBar.addItem({title: 'Left 1'}, function() {
        console.log('Left 1 pressed');
    });
    navBar.addItem({title: 'Left 2', active: true});
    navBar.addText('Some text');
    navBar.addItem({title: 'Right 1', direction: 'right'});
    navBar.addItem(drop);
    navBar.addForm({inputText: 'Search'});*/

    /*var list = new dMVC.Vidgets.Breadcrumb();
    list.addItem({text: 'item 1'}, function() {
        console.log('item 1 clicked');
    });
    list.addItem({text: 'item 2'});
    list.addItem({text: 'item 3', active: true});

    container.add(list);

    console.log('view: ', list);*/

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




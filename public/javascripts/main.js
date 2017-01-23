$(function () {
    var TaskView = dMVC.View.subClass({

        type: 'Task',

        commands: {
            "delete": "deleteTask"
        },

        init: function(opt) {
            this.text = opt.text;
            this.modelID = opt.modelID;
            this.done = opt.done;
            this.render();
        },

        deleteTask: function (command) {
            if(command.id == this.modelID) {
                this.stopListening();
                this.$element.remove();
            }

        },

        render: function() {
            var $link = $('<span> X</span>');
            $link.click({self: this}, this.removeClick);
            this.$element.html(this.text).append($link);
            $("#tasks_block").append(this.$element);
        },

        removeClick: function(evt) {
            var self = evt.data.self;
            self.process('deleteTask');
        }

    });

    var AppView = dMVC.View.subClass({

        type: 'App',

        commands: {
            "create": "createTask"
        },

        //constructor
        init: function(opt) {
            this.$inputField = this.$element.find("#add_task");
            this.$element.submit({self: this}, this.formSubmit);
            this.process('getTasks');
            //parent method call
            //this._super(opt);
        },

        createTask: function (command) {
            var task = new TaskView({
                modelID: command.id,
                text: command.text,
                done: command.done,
                htmlTag: 'li'
            });
        },

        formSubmit: function(evt) {
            var self = evt.data.self;
            self.process('createTask', self.$inputField.val());
            self.$inputField.val('');
            return false;
        }

    });

    var app = new AppView({el: '#app_form'});
    console.log('app view: ', app);

});




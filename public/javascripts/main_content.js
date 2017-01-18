$(function() {

    //Реализация наследования
    (function() {
        var initializing = false,
            superPattern =  // Determine if functions can be serialized
                /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;

        // Creates a new Class that inherits from this class
        Object.subClass = function(properties) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var proto = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in properties) {
                // Check if we're overwriting an existing function
                proto[name] = typeof properties[name] == "function" &&
                typeof _super[name] == "function" &&
                superPattern.test(properties[name]) ?
                    (function(name, fn) {
                        return function() {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, properties[name]) :
                    properties[name];
            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init) {
                    this._preConstruct.apply(this, arguments);
                    this.init.apply(this, arguments);
                }
            }

            // Populate our constructed prototype object
            Class.prototype = proto;

            // Enforce the constructor to be what we expect
            Class.constructor = Class;

            // And make this class extendable
            Class.subClass = arguments.callee;

            return Class;
        };
    })();

    var EventProcessor = function() {

    };
    EventProcessor.prototype = {

        notify: function(opt) {
            var self = this;
            $.post('/events', opt, function(resp) {
                console.log('event response: ', resp);
                _.each(resp, function(item) {
                    self.trigger(item.command, item);
                });

            });
        }

    };
    _.extend(EventProcessor.prototype, Backbone.Events);
    var processor = new EventProcessor();

    var View = Object.subClass({

        type: 'view',

        commands: {},

        //pre-constructor
        _preConstruct: function (opt) {
            if(opt.el) {
                this.$element = $(opt.el);
            } else {
                var tag = opt.htmlTag || "div";
                this.$element = $("<" + tag + "/>");
            }
            _.each(this.commands, function (callback, command) {
                processor.on(command, this[callback], this);
            }, this);
        },

        //constructor
        init: function(opt) {
            //console.log('View init: ', opt);
        },

        process: function(type, data) {
            processor.notify({
                emitter: this.type,
                modelID: this.modelID,
                evtType: type,
                data: data
            });
        }

    });
    _.extend(View.prototype, Backbone.Events);

    var TaskView = View.subClass({

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

            console.log('task view removed');
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

    var AppView = View.subClass({

        type: 'App',

        commands: {
            "create": "createTask"
        },

        //constructor
        init: function(opt) {
            //console.log('AppView init: ', arguments.callee);
            this.$inputField = this.$element.find("#add_task");
            this.$element.submit({self: this}, this.formSubmit);
            this.process('getTasks');
            //вызов родительского метода
            //this._super(opt);
        },

        createTask: function (command) {
            //console.log('appViewEvent: ', command);
            var task = new TaskView({
                modelID: command.id,
                text: command.text,
                done: command.done,
                htmlTag: 'li'
            });
            console.log('task view: ', task);
        },

        formSubmit: function(evt) {
            var self = evt.data.self;
            self.process('createTask', self.$inputField.val());
            return false;
        }

    });

    //debugger;
    var app = new AppView({el: '#app_form'});
    console.log('app view: ', app);
    console.log('processor: ', processor);

});


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
                if (!initializing && this.init)
                    this.init.apply(this, arguments);
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
                self.trigger(resp.command, resp);
            });
        }

    };
    _.extend(EventProcessor.prototype, Backbone.Events);
    var processor = new EventProcessor();

    var View = Object.subClass({

        //constructor
        init: function(opt) {
            //console.log('View init: ', opt);
        },

        process: function(type, data) {
            processor.notify({
                emitter: this.id,
                evtType: type,
                data: data
            });
        }

    });
    _.extend(View.prototype, Backbone.Events);

    var TaskView = View.subClass({

        init: function(opt) {
            this.$container = $("#tasks_block");
            this.text = opt.text;
            this.id = opt.id;
            this.render();
        },

        render: function() {
            var $link = $('<span> X</span>');
            $link.click({self: this}, this.removeClick);
            this.$element = $('<li></li>').html(this.text).append($link);
            this.$container.append(this.$element);
        },

        removeClick: function(evt) {
            var self = evt.data.self;
            self.process('deleteTask');
        }

    });

    var AppView = View.subClass({

        //constructor
        init: function(opt) {
            //console.log('AppView init: ', opt);
            this.$el = $(opt);
            this.id = 'app_view';
            this.$inputField = this.$el.find("#add_task");
            this.$el.submit({self: this}, this.formSubmit);
            this.listenTo(processor, 'create', function(evt) {
                //console.log('appViewEvent: ', evt);
                var task = new TaskView({id: evt.id, text: evt.text});
                console.log('task view: ', task);
            });
            //вызов родительского метода
            //this._super(opt);
        },

        formSubmit: function(evt) {
            var self = evt.data.self;
            self.process('createTask', self.$inputField.val());
            /*$.post(self.url, {data: self.$inputField.val()}, function(resp) {
                var task = new TaskView({id: resp.id, text: resp.text});
                console.log('task view: ', task);
            });*/
            return false;
        }

    });

    var app = new AppView('#app_form');
    console.log('app view: ', app);
    console.log('processor: ', processor);

});


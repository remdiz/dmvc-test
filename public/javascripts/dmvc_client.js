//TODO: error display
//TODO: client-side elements validation

//Inheritance implementation (c)J.Resig
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

(function() {

    var root = this,
        dMVC = {};

    /**
     * Client-side events & server commands handler
     * @constructor
     */
    var EventProcessor = function(opt) {
        opt = opt || {};
        if(opt.sockets) {
            var self = this;
            this._socket = io.connect('http://localhost:3333');
            this._socket.on('connect', function () {
                console.log('socket connected: ', this);
                self._socket.on('message', function (msg) {

                    console.log('socket message: ', msg);

                    _.each(msg, function(item) {
                        self.trigger(item.command, item);
                    });

                });

                //self._socket.send('Init message');

            });

        }
    };
    EventProcessor.prototype = {

        /**
         * Send event to back-end via jQuery $.post function
         * @param opt {Object} to send
         */
        notify: function(opt) {
            //var self = this;
            this._socket.send(opt);

            /*$.post('/controllers', opt, function(resp) {
                _.each(resp, function(item) {
                    self.trigger(item.command, item);
                });

            });*/
        }

    };

    var Composite = {

        add: function(item) {

            if(!item)
                return;
            this.children[item.cid] = item;
            this.$element.append(item.$element);

        },

        remove: function(item) {

            if(item) {
                var id = _.isObject(item) ? item.cid : item;

                this.children[id].remove();
                delete this.children[id];
            } else {
                this.stopListening();
                this.$element.remove();
            }

        },

        find: function(cid) {

            for(var id in this.children) {
                var child = this.children[id];
                if(id == cid) {
                    return child;
                }
                if(!_.isEmpty(child.children)) {
                    var inner =  child.find(cid);
                    if(inner)
                        return inner;
                }


            }
            return null;
        }
    };

    /**
     * Using Backbone.Events
     */
    _.extend(EventProcessor.prototype, Backbone.Events);
    var processor = new EventProcessor({sockets: true});

    /**
     * Main View class
     */
    dMVC.View = Object.subClass({

        /**
         * we use this field to identify event emitter on back-end
         */
        type: 'view',

        /**
         * command storage
         * (key-value pairs, key=command name, value=command handler
         */
        commands: {},

        //pre-constructor
        _preConstruct: function (opt) {

            //this.parents = [];
            var self = this;
            this.children = {};
            this.cid = _.uniqueId('view_');
            if(opt.el) {
                this.$element = $(opt.el);
            } else {
                var tag = opt.htmlTag || "div";
                this.$element = $("<" + tag + "/>");
            }

            this.$element.addClass(opt.class);

            this.$element.attr(opt.attrs || {});

            //TODO: refactor to method
            if(opt.events) {
                for(var name in opt.events) {
                    this.$element.on(name, function() {
                        opt.events[name].apply(opt.context || self, arguments);
                        return false;
                    });
                }
            }

            if(opt.html) {
                this.$element.html(opt.html);
            }


            //если создается корневой эл-т без указания el, нужно крепить его к чему-то, это будет container
            if(opt.container) {
                $(opt.container).append(this.$element);
            }

            for(var evtName in this.events) {
                var callback = this.events[evtName];
                this.$element.on(evtName, function() {
                    self[callback].apply(self, arguments);
                    return false;
                })
            }

            _.each(this.commands, function (callback, command) {
                processor.on(command, this[callback], this);
            }, this);

        },

        //constructor
        init: function(opt) {

        },

        /**
         * Send event object to EventProcessor
         * @param type {String} - event type
         * @param data {*} - additional event data
         */
        process: function(type, data) {
            processor.notify({
                emitter: this.type,
                cid: this.cid,
                evtType: type,
                data: data
            });
        }

    });
    _.extend(dMVC.View.prototype, Backbone.Events, Composite);

    root.dMVC = dMVC;

})(this);



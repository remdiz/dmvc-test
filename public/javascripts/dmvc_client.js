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

/**
 * Client-side events & server commands handler
 * @constructor
 */
var EventProcessor = function() {

};
EventProcessor.prototype = {

    /**
     * Send event to back-end via jQuery $.post function
     * @param opt {Object} to send
     */
    notify: function(opt) {
        var self = this;
        $.post('/controllers', opt, function(resp) {
            _.each(resp, function(item) {
                self.trigger(item.command, item);
            });

        });
    }

};

/**
 * Using Backbone.Events
 */
_.extend(EventProcessor.prototype, Backbone.Events);
var processor = new EventProcessor();

/**
 * Main View class
 */
var View = Object.subClass({

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

    },

    /**
     * Send event object to EventProcessor
     * @param type {String} - event type
     * @param data {*} - additional event data
     */
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

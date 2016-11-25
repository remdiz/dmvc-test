$(function() {

    //SOCKETS
    var socket = io.connect('http://localhost:3333');
    socket.on('connect', function () {
        console.log('socket connected: ', this);
        socket.on('message', function (msg) {

            console.log('socket message: ', msg);

        });

        socket.send('Init message');

    });


    var $adapter = function(selector) {
        return new jqAdapter(selector);
    };

    var commandsResolver = function(commands) {
        _.each(commands, function(command) {

            execute(command);

        });
    };
    var execute = function(command) {
        var jObj = $adapter(command.selector);

        _.each(command.next, function(next) {
            jObj[next.command](next.arguments);
        });
    };

    $(document).on('click', '.on_click', function(evt) {
        var serialized = JSON.stringify(evt, ['altKey', 'clientX', 'clientY', 'ctrlKey', 'shiftKey', 'target', 'className', 'id', 'innerHTML', 'innerText', 'nodeName', 'outerHTML', 'outerText', 'type']);
        //$.post('/events', {evtType: 'click', evtObject: serialized}, commandsResolver);
        socket.send({event: 'click', evtObject: serialized});
    });


    $(document).on('submit', '.on_submit', function(evt) {
        evt.preventDefault();

        var form = $(this).find('*').map(function() {
            if(!this.type && !this.name && !this.value)
                return null;
            return {
                type: this.type,
                name: this.name,
                value: this.value
            };
        });
        var formFields = JSON.stringify($.makeArray(form));


        //$.post('/events', {evtType: 'submit', evtObject: formFields}, commandsResolver);
        socket.send({event: 'submit', evtObject: formFields});


    });

    $.get('/init', commandsResolver);

    var jqAdapter = function(selector) {
        this.$el = $(selector);
    };

    jqAdapter.prototype = {

        append: function(args) {
            var target = _.first(args),
                jObj = $adapter(target.selector);
            _.each(target.next, function(next) {    //TODO: refactor (create method processNext() )
                jObj[next.command](next.arguments);
            });
            this.$el.append(jObj.$el);
            console.log('append: ', target.selector, this.$el);
            return this.$el;
        },

        parent: function(args) {
            this.$el = this.$el.parent();
            return this.$el;
        },

        remove: function(args) {
            this.$el.remove();
        }

    };

});


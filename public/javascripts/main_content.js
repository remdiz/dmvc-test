$(function() {

    $(document).on('click', '.on_click', function(evt) {
        var serialized = JSON.stringify(evt, ['altKey', 'clientX', 'clientY', 'ctrlKey', 'shiftKey', 'target', 'className', 'id', 'innerHTML', 'innerText', 'nodeName', 'outerHTML', 'outerText', 'type']);
        $.post('/events', {evtType: 'click', evtObject: serialized}, function(resp) {
            _.each(resp, function(command) {
                var com = new CommandProcessor(command);
                com.execute();
            });
        });
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


        $.post('/events', {evtType: 'submit', evtObject: formFields}, function(resp) {
            _.each(resp, function(command) {
                var com = new CommandProcessor(command);
                com.execute();
            });
        });

        console.log('submit: ', evt, this, formFields);

    });

    var CommandProcessor = function(command) {
        this.command = command;
    };

    CommandProcessor.prototype = {

        execute: function() {
            console.log('Execute: ', this.command);

            //TODO: stopped here
            //привести в порядок класс - сложно наращивать ф-ал (напр. добавить поиск родителя эл-та для удаления)

            var content;
            if(_.isObject(this.command.content)) {
                var inner = new CommandProcessor(this.command.content);
                content = inner.execute();
            } else {
                content = $adapter(this.command.content);
            }

            if(this.command.insert) {
                _.each(this.command.insert, function(ins) {
                    var obj = new CommandProcessor(ins);
                    content.append(obj.execute());
                });

            }
            if(this.command.events) {
                _.each(this.command.events, function(evt) {
                    content.on(evt.name, evt.url, evt.lookFor);
                });
            }
            if(this.command.target) {
                return $adapter(this.command.target)[this.command.name](content);
            } else {
                return content;
            }

            //$adapter(this.command.target)[this.command.name](_.isObject(com.content) ? $adapter())
            //this[com.name](com);
        },

        /*append: function(command) {
            console.log('Append: ', command);
            var content = this[command.content.name](command.content);
            $adapter(command.target).append([content]);
        },

        create: function(command) {
            var insertion = _.map(command.insert, function(element) {
                return this[element.name](element);
            }, this);
            var obj = $adapter(command.html);
            obj.setListeners(command.events);
            obj.append(insertion);
            return obj;
        }*/

    };


    var jqAdapter = function(selector) {
        this.$el = $(selector);
    };

    jqAdapter.prototype = {

        append: function(elements) {
            _.each(elements, function(el) {
                this.$el.append(el);
            }, this);
        },

        setListeners: function(events) {
            _.each(events, function(evt) {
                 this.on(evt.name, evt.url, evt.lookFor);
            }, this);
        },

        /*on: function(evtName, url, lookFor) {
            this.$el.on(evtName, function(evt) {
                //console.log('On ' + evtName, evt.target.task.value);
                //TODO: добавить метод создания типового объекта для передачи на сервер (со всеми возможными св-вами: value, id...)
                $.post(url, {
                    type: evt.type,
                    targetID: evt.target.id,
                    task: lookFor ? evt.target[lookFor].value : null
                }, function(data) {
                    console.log('Resp: ', data);
                    _.each(data, function(command) {
                        var com = new CommandProcessor(command);
                        com.execute();
                    });

                });
                return false;
            });
        }*/

    };

    var $adapter = function(selector) {
        return new jqAdapter(selector);
    };

    //$adapter('#app_form').on('submit', '/events', 'task');
    //console.log('Adapter: ', $adapter);

    //jqAdapter.id('app_form').on('submit');

    /*$("#app_form").submit(function() {

        //viewsController.add($("#add_task").val());

        $.post('/events', {name: 'submit', target: 'app_form', text: $("#add_task").val()}, function(data) {
            console.log('received: ', data);

        }, 'json');

        return false;
    });*/

});


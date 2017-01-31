var _ = require('../public/plugins/underscore');

var dMVC = require('dmvc');

dMVC.TaskModel = dMVC.Model.subClass({

    validationRules: {
        task: ['Required', 'String']
    },

    toJSON: function() {
        return {
            task: this.task,
            id: this.id,
            done: this.done
        };
    },

    /**
     * Initialization method
     * @param opt {Object}
     */
    init: function(opt) {
        _.extend(this, opt);
    }

});

dMVC.TaskMapper = dMVC.ModelMapper.subClass({

    table: 'Tasks',
    schema: {
        userID: String,
        task: String,
        done: Boolean
    },

    init: function (opt) {
        this._dbAdapter.connect({
            connection: 'mongodb://localhost/dmvc',
            schemaName: this.table,
            schema: this.schema
        });
    },

    getByID: function(id) {

        var task = this._dbAdapter.find(id);
        return this.mapToTask(task);

    },

    mapToTask: function(task) {
        return new dMVC.TaskModel({
            id: task._id,
            task: task.task,
            userID: task.userID,
            done: task.done
        });
    },

    getUserTasks: function (id, callback) {
        var self = this;
        this._dbAdapter.find({userID: id}, function (rows) {
            if(rows.error) {
                callback(rows);
            } else {
                var tasks = _.map(rows, function (row) {
                    return self.mapToTask(row);
                });
                callback(tasks);
            }
        });
    },

    saveTask: function(taskModel, callback) {

        if(!taskModel.validate()) {
            callback({error: 'Validation Error'}, taskModel);
        } else {
            this._dbAdapter.save(taskModel.toJSON(), callback);
        }

    },

    deleteTask: function (id, callback) {
        this._dbAdapter.remove(id, callback);
    }

});

dMVC.AppController = dMVC.Controller.subClass({

    createTask: function(req, res, next) {
        var taskController = new dMVC.TaskController();
        taskController.newTask(req, res, next);

    },


    getTasks: function(req, res, next) {
        var taskController = new dMVC.TaskController();
        taskController.getAll(req, res, next);
    }

});

dMVC.TaskController = dMVC.Controller.subClass({

    getAll: function(req, res, next) {
        var taskMapper = new dMVC.TaskMapper({
            adapter: new dMVC.MongoDBAdapter()
        });
        taskMapper.getUserTasks(req.session.userID, function(tasks) {
            if(tasks.error) {
                res.json({error: tasks.error});
            } else {
                //TODO: implement some kind of command manager
                var commands = _.map(tasks, function(task) {
                    return {
                        command: 'create',
                        id: task.id,
                        text: task.task,
                        done: task.done
                    }
                });
                res.json(commands);
            }
        });

    },

    newTask: function(req, res, next) {

        var task = new dMVC.TaskModel({
            task: req.body.data,
            userID: req.session.userID,
            done: false
        });

        var taskMapper = new dMVC.TaskMapper({
            adapter: new dMVC.MongoDBAdapter()
        });
        taskMapper.saveTask(task, function (err, record) {
            if(err) {
                //TODO: handle error
                res.json([{error: err}]);
            } else {
                //console.log(record);
                res.json([{
                    command: 'create',
                    id: record._id,
                    text: record.task,
                    done: record.done
                }]);
            }
        });

    },

    deleteTask: function(req, res, next) {
        var taskMapper = new dMVC.TaskMapper({
            adapter: new dMVC.MongoDBAdapter()
        });
        taskMapper.deleteTask(req.body.cid, function(err) {
            if(err) {
                //TODO: handle error
                res.json([]);
            } else {
                res.json([{
                    command: 'delete',
                    id: req.body.cid
                }]);
            }

        });

    }

});

module.exports = dMVC.router;
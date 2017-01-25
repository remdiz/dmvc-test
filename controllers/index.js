var _ = require('../public/plugins/underscore');

var dMVC = require('dmvc');

dMVC.TaskModel = dMVC.Model.subClass({

    table: 'Tasks',

    columns: {
        userID: String,
        task: String,
        done: Boolean
    },

    deleteByID: function(id, callback) {

        this._table.remove({_id: id}, callback);
    },

    getUserTasks: function(userID, callback) {

        this._table.find({userID: userID},function (err, tasks) {
            if (err) {
                callback({error: err});
            } else {
                callback(tasks);
            }
        });
    }

});

dMVC.AppController = dMVC.Controller.subClass({

    createTask: function(req, res, next) {
        var taskController = new dMVC.TaskController();
        var task = taskController.newTask(req.body.data, req.session.userID);
        task.save(function(err, record) {
            if(record.error) {
                //TODO: handle error
                res.json([]);
            } else {
                res.json([{
                    command: 'create',
                    id: record._id,
                    text: record.task,
                    done: record.done
                }]);
            }
        });

    },


    getTasks: function(req, res, next) {
        var taskController = new dMVC.TaskController();
        taskController.getAll(req, res, next);
    }

});

dMVC.TaskController = dMVC.Controller.subClass({

    model: 'TaskModel',

    getAll: function(req, res, next) {
        this.modelInstance.getUserTasks(req.session.userID, function(tasks) {
            if(tasks.error) {
                res.json({error: tasks.error});
            } else {
                var commands = _.map(tasks, function(task) {
                    return {
                        command: 'create',
                        id: task._id,
                        text: task.task,
                        done: task.done
                    }
                });
                res.json(commands);
            }
        });

    },

    newTask: function(text, userID) {
        var task = {task: text, userID: userID, done: false};
        return this.modelInstance.create(task);

    },

    deleteTask: function(req, res, next) {
        this.modelInstance.deleteByID(req.body.cid, function(err) {
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
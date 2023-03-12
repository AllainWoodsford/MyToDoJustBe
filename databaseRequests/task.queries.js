const { connect } = require('../dbSequelize.js');

class TaskQueries {
    db = {};

    constructor() {
        this.db = connect();
        //For Development if { force: true } drops table if it exists incase fields need to change

        // this.db.sequelize.sync({ force: true } ).then(() => {
        //     console.log("Drop and re-sync db.");
        // });
    }

    //Get Task
    async getTask(data, attributes){
        try {
            console.log('try to find');
            console.log(data.id);

            const foundTask = await this.db.sequelize.models.tasks.findOne({
                where: {
                    id:data.id
                 },
                 attributes: attributes}
             );
            console.log('found success');
            return foundTask;
        }
        catch {
            console.log('failed to find');
            return null;
        }
    };


    //Get All Tasks in a list
    async getAllTasks(data, attributes){
        try {
            const allTasks = await this.db.sequelize.models.tasks.findAll({
                where: {listId: data},
                attributes:{attributes}
            });

            return allTasks;
        }
        catch(err){

            return [];
        }
    };

    //Create new Task
    async createTask(data){
        try{
            const newTask= await this.db.sequelize.models.tasks.create({
                listId: data.listId,
                taskName: data.taskName,
                isDone: data.isDone,
                isTranslated: data.isTranslated
            });
            return newTask;
        }
        catch(err){
            console.log('ERROR IN Create Task block'+ err);
            return null;
        }
    };

    //danger zone
    //delete task
    //calls get task
    //returns true if destroyed false if not
    async deleteTask(data,attributes){
        try{
            console.log("lookin for task to delete");
            const foundTask = await this.getTask(data,attributes);
            if(foundTask){
                await  foundTask.destroy();
                console.log('elbow destruction!');
                return true;
            }

            console.log('no destroy');
            return false;


        } catch {
            console.log('error on destruction!');
            return false;
        }
    }

}

module.exports = new TaskQueries();

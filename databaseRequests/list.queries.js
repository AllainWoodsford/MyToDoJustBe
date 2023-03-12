const { connect } = require('../dbSequelize.js');

class ListQueries {
    db = {};

    constructor() {
        this.db = connect();
        //For Development if { force: true } drops table if it exists incase fields need to change

        // this.db.sequelize.sync({ force: true } ).then(() => {
        //     console.log("Drop and re-sync db.");
        // });
    }

    //Create new List
    async createList(data){
        try{
           const newList= await this.db.sequelize.models.lists.create({
                userid: data.userid,
                listName: data.listName
            });
            const listId = newList.listId;
            if(listId != -1){
                return listId;
            }
            else{
                return -1;
            }
        }
        catch(err){

            return -1;
        }
      }
    //Get a list id
    async getList(data, attributes){
        try{
            //data in this case is going to be a string needs to be parsed to an int
            //users can't set listNames yet so by defualt we'll get the default list that gets auto generated

            const foundList = await this.db.sequelize.models.lists.findOne({
                where: {
                   userid:data,
                   listName:'default'
                },
                attributes: attributes}
            );
            if(foundList){

                return foundList.listId;
            }
            return -1;
        }
        catch(err) {

            return -1;
        }
    }
}

module.exports = new ListQueries();

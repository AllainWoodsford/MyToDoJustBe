const { connect } = require('../dbSequelize.js');
class UserQueries {
    db = {};

    constructor() {
        this.db = connect();
      //  For Development if { force: true } drops table if it exists incase fields need to change

        // this.db.sequelize.sync({force:true } ).then(() => {
        //     console.log("Drop and re-sync db.");
        // });
    }

      //Run at register minmised version of find user
      //Repeating code here refactor later
      async findUserById(targetUser,attributes){
        try{
            const user = await this.db.sequelize.models.users.findOne({
                where: {
                    userid: `${targetUser}`
                },
                attributes: attributes});
            if(user){
                return user;
            }
            return null;
        }
        catch(err){
            return null;
        }
    }


    //Run at register minmised version of find user
    async findUser(targetUser,attributes){
        try{
            const user = await this.db.sequelize.models.users.findOne({
                where: {
                    username: `${targetUser}`
                },
                attributes: attributes});
            if(user){
                return user;
            }
            return null;
        }
        catch(err){
            return null;
        }
    }

    //Create user at register
    async createUser(data){
        try{

            const newUser = await this.db.sequelize.models.users.create({
                username: data.username,
                password: data.password,
                createdDate: data.timeStamp,
                translationDefault: data.translationDefault,
                translationTarget: data.translationTarget,
                adminFlag: 1//data.adminFlag
            });

            if(newUser) {

                return true;
            }
            else {

                return false;
            }
        }
        catch(err){
            return false;
        }
    }
}

module.exports = new UserQueries();

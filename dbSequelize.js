const { Sequelize, Model, DataTypes } = require("sequelize");


const connect = () => {

    const hostName = process.env.PGHOST;
    const userName = process.env.PGUSER;
    const password = process.env.PGPASSWORD;
    const database = process.env.PGDATABASE;


    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect: 'postgres',
        dialectOptions:{
            ssl:true
        },
        operatorsAliases: 0,
        pool: {
            max: 10,
            min: 0,
            acquire: 20000,
            idle: 5000
        },

    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.users = require('./model/user')(sequelize, DataTypes, Model);
    db.tasks = require('./model/task')(sequelize, DataTypes, Model);
    db.lists = require('./model/list')(sequelize, DataTypes, Model);
    db.audits = require('./model/audit')(sequelize, DataTypes, Model);
    return db;

}

module.exports = {
    connect
}

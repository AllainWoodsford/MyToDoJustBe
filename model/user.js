module.exports = (sequelize, DataTypes, Model) => {

    class Users extends Model {}

    Users.init({
        // Model attributes are defined here
        userid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        username: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique:true,
          max: 64,
          min: 2
          // allowNull defaults to true
        },
        password: {
          type: DataTypes.STRING(64),
          allowNull: false,
          max:64 ,
          min:7
          // allowNull defaults to true
        },
        email: {
            type: DataTypes.TEXT,
            validate:{
                isEmail:true
            }
            // allowNull defaults to true
        },
        createdDate: {
            type: DataTypes.DATE
        },
        lastAuthenticationDate: {
            type: DataTypes.DATE
            // allowNull defaults to true
        },
        loginAttempts: {
            type: DataTypes.INTEGER
        },
        translationDefault:{
            type: DataTypes.TEXT,
            max:20
        },
        translationTarget:{
            type: DataTypes.TEXT,
            max:20
        },
        adminFlag:{
          type: DataTypes.INTEGER
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'users' // We need to choose the model name
      });
      
      return Users;
}
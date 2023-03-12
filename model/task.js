module.exports = (sequelize, DataTypes, Model) => {

    class Tasks extends Model {}

    Tasks.init({
        // Model attributes are defined here
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        listId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          foreignKey:true
          // allowNull defaults to true
        },
        taskName: {
          type: DataTypes.TEXT,
          allowNull: false,
        //   validate:{
        //     isAlphanumeric: true
        //   },
          max:150 ,
          min:1
          // allowNull defaults to true
        },
        isDone: {
            type: DataTypes.BOOLEAN
           
            // allowNull defaults to true
        },
        isTranslated: {
            type: DataTypes.BOOLEAN
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'tasks' // We need to choose the model name
      });
      
      return Tasks;
}
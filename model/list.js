module.exports = (sequelize, DataTypes, Model) => {

    class Lists extends Model {}

    Lists.init({
        // Model attributes are defined here
        listId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        userid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          foreignKey:true
          // allowNull defaults to true
        },
        listName: {
          type: DataTypes.TEXT,
          allowNull: true,
        //   validate:{
        //     isAlphanumeric: true
        //   },
          max:150 ,
          min:1
          // allowNull defaults to true
        }
        
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'lists' // We need to choose the model name
      });
      
      return Lists;
}
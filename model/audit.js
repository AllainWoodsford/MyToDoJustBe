module.exports = (sequelize, DataTypes, Model) => {

  class Audits extends Model {}

  Audits.init({
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique:false,
        max: 64,
        min: 2

        // allowNull defaults to true
      },
      ref: {
        type: DataTypes.INTEGER,
        allowNull: false
        // allowNull defaults to true
      },
      entry: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      modelName: 'audits' // We need to choose the model name
    });

    return Audits;
}



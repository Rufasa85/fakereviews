module.exports = function(sequelize, DataTypes) {
    var Platform = sequelize.define('Platform', {
         name: {
            type:DataTypes.STRING,
            unique:true,
            allowNull:false
         }
    });

    Platform.associate = function(models) {
        // add associations here
        Platform.belongsToMany(models.Review,{through:"ReviewPlatform"});
    };

    return Platform;
};
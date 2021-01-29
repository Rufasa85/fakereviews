module.exports = function(sequelize, DataTypes) {
    var Review = sequelize.define('Review', {
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        review:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        score:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate:{
                min:0,
                max:10
            }
        },
    });

    Review.associate = function(models) {
        // add associations here
        Review.belongsTo(models.User);
    };

    return Review;
};
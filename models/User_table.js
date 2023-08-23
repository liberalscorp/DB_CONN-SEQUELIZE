const seq = require('./dbconn.js');
const { DataTypes } = require('sequelize'); 

const User = seq.define('user', { 
    // id
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // Name
    name: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    // Age
    age: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    // Date Added
    date_added: {
        type: DataTypes.DATE, 
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: false
});


// Sync the model with the database
User.sync({alter : true})
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch(error => {
        console.error('Error synchronizing the database:', error);
    });

User.prototype.toJson = function () {
    const { id, name, age, date_added } = this.dataValues;
    return { id, name, age, date_added };
};

    
module.exports = User;
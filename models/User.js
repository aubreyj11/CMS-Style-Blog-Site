const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    checkPassword(loginPassword) {
        return bcrypt.compareSync(loginPassword, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5]
            }
        }
    },
    { 
        hooks: {
            async beforeCreate(newUserInfo) {
                newUserInfo.password = await bcrypt.hash(newUserInfo.password, 10);
                return newUserInfo;
            },
            async beforeUpdate(updatedUserInfo) {
                updatedUserInfo.password = await bcrypt.hash(updatedUserInfo.password, 10);
                return updatedUserInfo;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;
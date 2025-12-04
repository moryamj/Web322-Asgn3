const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        dueDate: { type: DataTypes.DATE, allowNull: true },
        status: { type: DataTypes.STRING, defaultValue: 'pending' },
        userId: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    });

    Task.beforeUpdate((task) => {
        task.updatedAt = new Date();
    });

    return Task;
};
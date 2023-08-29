module.exports = (sequelize, DataTypes) => {
    const UtilisateurClient = sequelize.define("UtilisateurClient", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'UtilisateurClient', // Spécifiez le nom de table souhaité
        timestamps: false // Désactive les timestamps
    });

    return UtilisateurClient;
}
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    id_role: { type: DataTypes.INTEGER, allowNull: false },
    date_naissance: { type: DataTypes.DATEONLY, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    id_agence: { type: DataTypes.INTEGER, allowNull: false },
    mdp: { type: DataTypes.STRING, allowNull: false },
    bloquer: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'users',
    timestamps: true,
  });
  
  export default User;
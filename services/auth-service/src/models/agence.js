import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Agence = sequelize.define('Agence', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.STRING, allowNull: false },
  nom: { type: DataTypes.STRING, allowNull: false },
  departement: { type: DataTypes.STRING, allowNull: false }
});

export default Agence;
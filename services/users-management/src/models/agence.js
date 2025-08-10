import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Agence = sequelize.define('Agence', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('Direction', 'Agence'), allowNull: false },
  nom: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'agences',
  timestamps: true,
});

export default Agence;
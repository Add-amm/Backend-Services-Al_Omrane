import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Supplier = sequelize.define('Supplier', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_fiscal: { type: DataTypes.STRING, allowNull: false, unique: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: false },
    n_tel: { type: DataTypes.STRING, allowNull: false, unique: true },
    file_id: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'suppliers',
    timestamps: false
});
  
export default Supplier;
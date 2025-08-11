import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  type: { type: DataTypes.ENUM('Entretien', 'Informatique', 'Bureautique'), allowNull: false },
  nom: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  dateAchat: { type: DataTypes.DATEONLY, allowNull: false },
  prix: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false },
  id_fournisseur: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'products',
  timestamps: false,
});

export default Product;
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  n_demande: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_demandeur: { type: DataTypes.STRING, allowNull: false },
  Date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  id_produit: { type: DataTypes.INTEGER, allowNull: false },
  quantite: { type: DataTypes.INTEGER, allowNull: false },
  statut: {
    type: DataTypes.ENUM('en_attente_directeur', 'en_attente_responsable', 'rejete', 'accepte'),
    allowNull: false, defaultValue: 'en_attente_directeur'
  },
  motif_refus: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'orders',
  timestamps: false,
});

export default Order;
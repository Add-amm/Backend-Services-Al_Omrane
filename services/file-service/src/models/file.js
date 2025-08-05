import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const File = sequelize.define('File', {
  fileName: { type: DataTypes.STRING, allowNull: false },
  mimeType: { type: DataTypes.STRING },
  size: { type: DataTypes.INTEGER },
  file: { type: DataTypes.BLOB('long'), allowNull: false },
}, {
  tableName: 'files',
  timestamps: false
});

export default File;
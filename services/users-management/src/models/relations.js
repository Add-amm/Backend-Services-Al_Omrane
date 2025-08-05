import Agence from './agence.js';
import User from './user.js';
import Role from './role.js';

  
User.belongsTo(Role, { foreignKey: 'id_role' });
User.belongsTo(Agence, { foreignKey: 'id_agence' });

Role.hasMany(User, { foreignKey: 'id_role' });

Agence.hasMany(User, { foreignKey: 'id_agence' });

export { Agence, User, Role };
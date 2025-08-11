import Order from './order.js';
import User from './user.js';
import Product from './product.js';
import Supplier from './supplier.js';


Order.belongsTo(User, { foreignKey: 'id_demandeur' });
Order.belongsTo(Product, { foreignKey: 'id_produit' });

User.hasMany(Order, { foreignKey: 'id_demandeur' });
Product.hasMany(Order, { foreignKey: 'id_produit' });


Product.belongsTo(Supplier, { foreignKey: 'id_fournisseur' });
Supplier.hasMany(Product, { foreignKey: 'id_fournisseur' });

export { Order, User, Product, Supplier };
const {Restaurant} = require('./Restaurant')
const {Menu} = require('./Menu')
const {Items} = require('../Items')

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

Menu.belongsToMany(Items, { through: 'menu_items' });
Items.belongsToMany(Menu, { through: 'menu_items' });

module.exports = { Restaurant, Menu, Items }

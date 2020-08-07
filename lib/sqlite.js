const path = require('path')

const Sequelize = require('sequelize')
const sequelizeCursorPagination = require('sequelize-cursor-pagination')

/* Init database */

const sequelize = new Sequelize('gopkg', undefined, undefined, {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../dist/data.sqlite'),
  // operatorsAliases: Sequelize.Op,
  logging: true,
  define: {
    timestamps: false,
    freezeTableName: true
  }
})

/* Create tables */

const code = { type: Sequelize.STRING, primaryKey: true }
const name = Sequelize.STRING
const primaryKeyField = 'code'

const Province = sequelize.define('province', { code, name }, {underscored: true})
const City = sequelize.define('city', { code, name }, {underscored: true})
const Area = sequelize.define('area', { code, name }, {underscored: true})
const Street = sequelize.define('street', { code, name }, {underscored: true})
const Village = sequelize.define('village', { code, name }, {underscored: true})

/* With pagination */

sequelizeCursorPagination({ primaryKeyField })(Province)
sequelizeCursorPagination({ primaryKeyField })(City)
sequelizeCursorPagination({ primaryKeyField })(Area)
sequelizeCursorPagination({ primaryKeyField })(Street)
sequelizeCursorPagination({ primaryKeyField })(Village)

/* Set foreign key */

Province.hasMany(City)

City.belongsTo(Province)
City.hasMany(Area)

Area.belongsTo(Province)
Area.belongsTo(City)
Area.hasMany(Street)

Street.belongsTo(Province)
Street.belongsTo(City)
Street.belongsTo(Area)
Street.hasMany(Village)

Village.belongsTo(Province)
Village.belongsTo(City)
Village.belongsTo(Area)
Village.belongsTo(Street)

/* Connect database */

async function init () {
  try {
    await sequelize.sync()
  } catch (err) {
    console.log(err)
    process.exit(-1)
  }
}

module.exports = { init, Province, City, Area, Street, Village }

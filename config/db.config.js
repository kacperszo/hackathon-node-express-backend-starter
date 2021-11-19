import { Sequelize } from 'sequelize/dist'
export const sequelize = new Sequelize('database', 'root', '', {
  dialect: 'mariadb',
})

import { Sequelize, DataTypes } from 'sequelize/dist'
import { sequelize } from '../config/db.config'
export const User = sequelize.define('User', {
  email: {
    type: DataTypes.TEXT,
  },
  firstname: {
    type: DataTypes.TEXT,
  },
  lastname: {
    type: DataTypes.TEXT,
  },
  password: {
    type: DataTypes.TEXT,
  },
})

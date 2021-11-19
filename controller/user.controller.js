import express, { request, response, Router } from 'express'
import { noExtendLeft } from 'sequelize/dist/lib/operators'
import * as yup from 'yup'
import { User } from './../model/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware/auth.middleware'

export const create = async (request, response, next) => {
  const validatorSchema = yup.object().shape({
    email: yup.string().email().required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    password: yup.string().min(8).required(),
  })
  try {
    await validatorSchema.validate(request.body)
    if (
      await User.findOne({
        where: {
          email: request.body.email,
        },
      })
    ) {
      throw new Error('User already exists')
    }
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    const user = await User.create({
      email: request.body.email,
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      password: hashedPassword,
    })

    return response.json({
      data: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    error.status = 400
    next(error)
  }
}
export const getUserById = async (request, response, next) => {
  try {
    const userId = request.params.userId
    if (request.loggedUser.id != userId) {
      throw new Error('forbidden')
    }
    const user = await User.findOne({
      where: {
        id: userId,
      },
    })

    return response.json({
      data: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    error.status = 403
    error.message = 'forbidden'
    next(error)
  }
}
export const login = async (request, response, next) => {
  const validatorSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  try {
    await validatorSchema.validate(request.body)
    const user = await User.findOne({
      where: {
        email: request.body.email,
      },
    })
    if (!user) throw new Error('Bad login or password')
    if (!(await bcrypt.compare(request.body.password, user.password)))
      throw new Error('Bad login or password')
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * (60 * 60),
        data: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      process.env.SECRET
    )
    return response.json({
      data: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
      },
    })
  } catch (error) {
    error.status = 403
    next(error)
  }
}

export const userRouter = Router()

userRouter.post('/user', create)
userRouter.post('/login', login)
userRouter.get('/user/:userId', authMiddleware, getUserById)

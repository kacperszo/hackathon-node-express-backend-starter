import express from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const secret = process.env.SECRET
  let token = req.body.token || req.query.token || req.headers['authorization']
  if (!token) {
    error = new Error('Token is required for authentication')
    error.status = 403
    throw error
  }
  token = token.replace(/Bearer /gi, '')
  try {
    const decode = jwt.verify(token, secret)
    req.loggedUser = { ...decode.data }
  } catch (err) {
    next(err)
  }
  return next()
}

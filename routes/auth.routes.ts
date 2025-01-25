import express from 'express'
import { IUser } from '../models/user.model'
import { login, signup } from '../controllers/user.controller'
import auth, { CustomRequest } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/signup', async (req:any, res:any) => {
  const userData: Partial<IUser> = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }
  const registeredUser = await signup(userData)
  if (registeredUser.error) {
    return res.status(400).json({
      error: registeredUser.error,
    })
  }
  return res.status(201).json(registeredUser)
})

router.post('/login', async (req:any, res:any) => {
  const userData: Partial<IUser> = {
    email: req.body.email,
    password: req.body.password,
  }
  const loggedInUser = await login(userData)
  if (loggedInUser?.error) {
    return res.status(400).json({
      error: loggedInUser.error,
    })
  }
  return res.status(200).json(loggedInUser)
})

// Fetch logged in user
router.get('/me', auth, async (req: CustomRequest, res:any) => {
  return res.status(200).json({
    user: req.user,
  })
})

// Logout user
router.post('/logout', auth, async (req: CustomRequest, res:any) => {
  if (req.user) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
  }

  return res.status(200).json({
    message: 'User logged out successfully.',
  })
})

// Logout user from all devices
router.post('/logoutall', auth, async (req: CustomRequest, res:any) => {
  if (req.user) {
    req.user.tokens = []
    await req.user.save()
  }
  return res.status(200).json({
    message: 'User logged out from all devices successfully.',
  })
})

export default router
